import { RedisService } from '@liaoliaots/nestjs-redis';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Settings } from 'src/interfaces/settings.module';
import { SettingsController } from './settings.controller';

@Injectable()
export class SettingsService {
  constructor(private readonly redisService: RedisService) {}
  async getSettings(): Promise<Settings> {
    try {
      const client = this.redisService.getClient();
      return JSON.parse(await client.get('settings'));
    } catch (error) {
      throw new ForbiddenException('No settings found');
    }
  }
  async setSettings(settings: Settings) {
    try {
      const client = this.redisService.getClient();
      await client.set('settings', JSON.stringify(settings));
      return JSON.parse(await client.get('settings'));
    } catch (error) {
      throw new ForbiddenException('No settings found');
    }
  }
}
