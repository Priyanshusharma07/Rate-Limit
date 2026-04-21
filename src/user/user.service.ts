import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
    private LIMIT = 5;
    private TTL = 60;

    constructor(private readonly redisService: RedisService) { }

    async handleRequest(userId: string, payload: any) {
        const key = `rate_limit:${userId}`;

        const count = await this.redisService.incr(key);
        await this.redisService.expire(key, this.TTL);

        await this.redisService.sadd('rate_limit_users', userId);

        if (count > this.LIMIT) {
            const ttl = await this.redisService.ttl(key);

            return {
                success: false,
                message: 'Rate limit exceeded',
                retry_after: ttl,
            };
        }

        return {
            success: true,
            remaining: this.LIMIT - count,
            data: payload,
        };
    }

    async getStats() {
        const stats: Record<string, any> = {};
        const users = await this.redisService.smembers('rate_limit_users');

        for (const userId of users) {
            const key = `rate_limit:${userId}`;

            const [count, ttl] = await Promise.all([
                this.redisService.get(key),
                this.redisService.ttl(key),
            ]);

            if (count !== null && ttl > 0) {
                stats[userId] = {
                    requests_last_minute: Number(count),
                    window_expires_in_seconds: ttl,
                };
            } else {
                await this.redisService.srem('rate_limit_users', userId);
            }
        }

        return stats;
    }
}