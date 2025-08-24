import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const cacheSet = async (key, data, ttlSeconds) => {
  try {
    await redisClient.set(key, JSON.stringify(data), { EX: ttlSeconds });
  } catch {}
};

export const cacheGet = async (key) => {
  try {
    const raw = await redisClient.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const cacheDel = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length) await redisClient.del(keys);
  } catch {}
};
