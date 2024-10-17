import Redis from 'ioredis';

let client = new Redis(process.env.REDIS_URL);

client.on('connect', () => {
  const { host, port } = client.options;
  console.log(`Connected to Redis at: ${port}`);
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default client;
