import { Body, Controller, Get, Post } from '@nestjs/common';
import { Settings } from 'src/interfaces/settings.module';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingService: SettingsService) {}
  @Post()
  async settings(@Body() body: Settings): Promise<Settings> {
    return this.settingService.setSettings(body);
  }
  @Get()
  async getSettings(): Promise<Settings> {
    return this.settingService.getSettings();
  }
}
