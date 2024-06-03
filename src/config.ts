import { Sequelize } from "sequelize";
import { createClient } from "redis";

export const sequelize = new Sequelize(process.env.DATABASE_URL!);

export const dbConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully");
        await sequelize.sync({ force: true });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to database:\n", error);
    }
};

export const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: function (retries) {
            if (retries > 10) {
                console.log(
                    "Too many attempts to reconnect. Redis connection was terminated"
                );
                return new Error("Too many retries.");
            } else {
                return retries * 500;
            }
        },
    },
});

redisClient.on("error", (error) => {
    console.error("Redis client error\n", error);
});
export const redisConnect = async () => {
    try {
        await redisClient.connect();
        console.log("Redis client connected successfully");
    } catch (error) {
        console.error("Error connecting to redis client\n", error);
    }
};
