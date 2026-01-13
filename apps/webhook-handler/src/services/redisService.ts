import { REDIS_CONNECTION_URL } from '@repo/common/src/envVariables/private';
import Redis from 'ioredis';

const redis = new Redis(REDIS_CONNECTION_URL);

export const redisService = {
  subdomainLatestCommitHash: {
    async get(iid: number): Promise<string | null> {
      const latestCommitHash = await redis.get(`subdomainLatestCommitHash:${iid}`);

      return latestCommitHash;
    },
    async set(iid: number, latestCommitHash: string): Promise<void> {
      await redis.set(`subdomainLatestCommitHash:${iid}`, latestCommitHash);
    },
    async delete(iid: number): Promise<void> {
      await redis.del(`subdomainLatestCommitHash:${iid}`);
    },
  },
};
