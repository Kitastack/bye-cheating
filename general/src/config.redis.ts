// redis.ts
import { createClient } from "redis";

// Todo: Setup Redis client
const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const testRedisConnection = async () => {
  try {
    await redis.connect();
    logging.info("successfully connected to redis");
  } catch (error) {
    logging.error("redis failed to connect");
    process.exit(1);
  }
};

// Todo: Setup global definition
declare global {
  var redis: ReturnType<typeof createClient>;
  var testRedisConnection: () => Promise<void>;
}

// Todo: Link the local and global variables
globalThis.redis = redis;
globalThis.testRedisConnection = testRedisConnection;

export { testRedisConnection };
