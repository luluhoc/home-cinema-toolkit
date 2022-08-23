import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpExceptionFilter } from 'src/filters/httpexc.filter';
import { SettingsInput } from './dto/settings.input';
import { Settings } from './settings.model';
import { SettingsService } from './settings.service';

@Resolver((of) => Settings)
export class SettingsResolver {
  constructor(private settingService: SettingsService) {}
  @Mutation((returns) => Settings)
  async settings(@Args('settings') settings: SettingsInput): Promise<Settings> {
    return this.settingService.setSettings(settings);
  }
  @Query((returns) => Settings)
  async getSettings(): Promise<Settings> {
    return this.settingService.getSettings();
  }
}
