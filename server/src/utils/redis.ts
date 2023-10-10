import { createClient, type RedisClientType } from "redis";

let redisClient: RedisClientType;

const initialiseRedis = async () => {
  redisClient = createClient({
    url: "redis://redis:6379",
  });
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
};

const getVal = async (key: string): Promise<string | null> => {
  let r = null;
  try {
    r = await redisClient.get(key);
  } catch (err) {
    console.log(err);
  }
  return r;
};

const setVal = async (key: string, val: string): Promise<void> => {
  try {
    await redisClient.set(key, val);
  } catch (err) {
    console.log(err);
  }
};

const removeVal = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.log(err);
  }
};

export { initialiseRedis, getVal, setVal, removeVal };
