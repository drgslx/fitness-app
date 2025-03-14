import { createClient } from 'redis';

// Replace with your Redis configuration
const redisClient = createClient({
  url: process.env.REDIS_URL // Environment variable for Redis connection URL
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

await redisClient.connect();

export default redisClient;
