import { Request, Response } from "express";
import crypto from "crypto";
import { Url } from "./models";
import { UniqueConstraintError } from "sequelize";
import { redisClient } from "./config";

function isValidURL(url: string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
export const createURLKey = async (req: Request, res: Response) => {
    if (!req.body.url)
        return res.status(422).json({ message: "No url provided" });

    // validate url
    if (!isValidURL(req.body.url))
        return res.status(422).json({ message: "Invalid url provided" });

    const hash = crypto
        .createHash("sha256")
        .update(req.body.url)
        .digest("base64url");
    const urlKey = hash.slice(0, 6); // 64 ^ 6 = 68.7 billion options

    // get original url of server
    const url = `${req.protocol}://${req.get("host")}`;
    try {
        const shortURL = await Url.create({ url: req.body.url, urlKey });

        // save url in cache and set expiry to 1 hour = 3600
        await redisClient.setEx(`${shortURL.urlKey}`, 3600, req.body.url);

        return res.status(200).json({
            message: "Link shortened successfully",
            data: `${url}/${shortURL.urlKey}`,
        });
    } catch (error) {
        console.error(error);
        // check for unique constraint error
        if (error instanceof UniqueConstraintError)
            return res.status(200).json({
                message: "Link shortened successfully",
                data: `${url}/${urlKey}`,
            });

        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getUrl = async (req: Request, res: Response) => {
    try {
        const { id: urlKey } = req.params;
        if (!urlKey) {
            return res.status(422).json({ message: "Invalid url provided" });
        }
        // check if url exists in cache
        const cachedUrl = await redisClient.get(urlKey);
        if (cachedUrl) {
            return res.redirect(301, cachedUrl);
        }

        // fetch url from database if not in cache
        const url = await Url.findOne({ where: { urlKey } });
        if (!url) {
            return res.status(404).json({ message: "Original link not found" });
        }
        return res.redirect(301, url.url);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};
