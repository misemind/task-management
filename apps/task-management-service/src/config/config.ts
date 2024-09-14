import { join } from "path";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    url: process.env.MONGODB_URI,
    type: 'mongodb',
    synchronize: true,
    entities: [join(__dirname, '/../modules/**/entities/*.entity{.ts,.js}')],
  },
});
