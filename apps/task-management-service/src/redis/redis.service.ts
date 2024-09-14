import { Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS') private readonly redisClient: Redis.Redis,
  ) {}

  async set(key: string, value: any, expireTimeInSeconds?: number): Promise<void> {
    if (expireTimeInSeconds) {
      await this.redisClient.set(key, JSON.stringify(value), 'EX', expireTimeInSeconds);
    } else {
      await this.redisClient.set(key, JSON.stringify(value));
    }
  }

  async get(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
