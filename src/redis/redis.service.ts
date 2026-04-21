import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  onModuleInit() {
    this.logger.log('Initializing Redis connection...');

    this.client = new Redis({
      host: process.env.REDIS_HOST || 'redis' || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      retryStrategy: (times) => {
        this.logger.warn(`Retrying Redis connection... attempt ${times}`);
        return Math.min(times * 100, 3000); // retry delay
      },
    });

    this.client.on('connect', () => {
      this.logger.log(' Redis connected');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error', err);
    });
  }


  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttl: number): Promise<number> {
    return this.client.expire(key, ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async sadd(key: string, value: string) {
    return this.client.sadd(key, value);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async srem(key: string, value: string): Promise<number> {
    return this.client.srem(key, value);
  }
}