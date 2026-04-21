import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class UserService {
    private redis = new Redis();

    private LIMIT = 5;
    private TTL = 60;

    async handleRequest(userId: string, payload: any) {
        const key = `rate_limit:${userId}`;

        const count = await this.redis.incr(key);
        await this.redis.expire(key, this.TTL);

        await this.redis.sadd('rate_limit_users', userId);

        if (count > this.LIMIT) {
            const ttl = await this.redis.ttl(key);

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
        const users = await this.redis.smembers('rate_limit_users');

        for (const userId of users) {
            const key = `rate_limit:${userId}`;

            const [count, ttl] = await Promise.all([
                this.redis.get(key),
                this.redis.ttl(key),
            ]);

            if (count !== null && ttl > 0) {
                stats[userId] = {
                    requests_last_minute: Number(count),
                    window_expires_in_seconds: ttl,
                };
            } else {
                await this.redis.srem('rate_limit_users', userId);
            }
        }

        return stats;
    }
}