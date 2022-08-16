import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { RootObject } from 'radarr';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RatingService {
  private readonly ratings: RootObject[] = [];

  constructor(private readonly redisService: RedisService) {}

  async checkRedis() {
    const client = await this.redisService.getClient();
    await client.set('test', JSON.stringify({ test: 'test' }));
    const json = await client.get('test');
    console.log(json); // [{"a":1}]
    return json;
  }
}
