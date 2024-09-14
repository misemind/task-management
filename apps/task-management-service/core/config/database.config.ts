import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  default: process.env.DB_TYPE || 'mongodb',
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase',
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
}));
