import { Module } from '@nestjs/common';
import { BotInfoSlashCommandModule } from './info';
import { BotMusicPlayerSlashCommandModule } from './musicPlayer';

@Module({
  imports: [BotInfoSlashCommandModule, BotMusicPlayerSlashCommandModule],
})
export class BotSlashCommandModule {}
