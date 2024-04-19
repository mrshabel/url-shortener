import express from "express";
import { dbConnect, redisConnect } from "./config";
import { createURLKey, getUrl } from "./url.controller";

const app = express();

// connect to database
dbConnect();
redisConnect();
app.use(express.json());
app.post("/shorten-url", createURLKey);
app.get("/:id", getUrl);

app.listen(8000, () => {
    console.log("server listening on port 8000");
});
