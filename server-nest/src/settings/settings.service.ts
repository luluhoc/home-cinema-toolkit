import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Settings } from 'src/interfaces/settings.module';
import { SettingsController } from './settings.controller';

@Injectable()
export class SettingsService {
  constructor(private readonly redisService: RedisService) {}
  private readonly settings: Settings = {
    keyOmdb: 'wdb',
    radarrUrl: 'localhost:7878/',
    radarrApi: '2389bdc157804ac1a1e0c6aa5516d100',
    deleteFiles: true,
    addExclusion: true,
    v3: true,
  };
  async getSettings(): Promise<Settings> {
    const client = this.redisService.getClient();
    return JSON.parse(await client.get('settings'));
  }
  async setSettings(settings: Settings) {
    const client = this.redisService.getClient();
    await client.set('settings', JSON.stringify(settings));
    return JSON.parse(await client.get('settings'));
  }
}
