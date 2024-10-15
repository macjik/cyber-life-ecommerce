// import Redis from 'ioredis';

// let client = new Redis(process.env.REDIS_URL);

// client.on('connect', () => {
//   //const address = `${client.options.host}:${client.options.port}`;
//   console.log('Connected to Redis at:', address);
// });

// export default client;

import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL });

export default client;
