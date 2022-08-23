import { Logger, Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsResolver } from './settings.resolver';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsResolver, SettingsService, Logger],
})
export class SettingsModule {}
