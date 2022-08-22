import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Settings } from 'src/interfaces/settings.module';

@Injectable()
export class SettingsGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = await this.redisService.getClient();
    const settings: Settings = JSON.parse(
      await client.get('settings'),
    ) as unknown as Settings;
    if (
      !settings ||
      !settings.keyOmdb ||
      !settings.radarrUrl ||
      !settings.radarrApi ||
      settings.deleteFiles === undefined ||
      settings.addExclusion === undefined
    ) {
      return false;
    }
    return true;
  }
}
