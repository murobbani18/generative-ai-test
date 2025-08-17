import { createClient } from "redis";

const { REDIS_HOST = "localhost", REDIS_PORT = 6379 } = process.env;

const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on("error", (err) =>
  console.error("❌ Redis Client Error:", err)
);

(async () => {
  try {
    await redisClient.connect();
    console.log(`✅ Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
  }
})();

export default redisClient;
