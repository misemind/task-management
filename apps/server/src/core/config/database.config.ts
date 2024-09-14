import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  default: process.env.DB_TYPE || 'mongodb',
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase',
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  dynamodb: {
    region: process.env.DYNAMODB_REGION,
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
    secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
}));
