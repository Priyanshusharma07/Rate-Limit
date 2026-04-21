import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
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
}