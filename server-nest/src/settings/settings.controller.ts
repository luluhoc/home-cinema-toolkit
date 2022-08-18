import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/httpexc.filter';
import { Settings } from 'src/interfaces/settings.module';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingService: SettingsService) {}
  @Post()
  @UseFilters(new HttpExceptionFilter())
  async settings(@Body() body: Settings): Promise<Settings> {
    return this.settingService.setSettings(body);
  }
  @Get()
  async getSettings(): Promise<Settings> {
    return this.settingService.getSettings();
  }
}
