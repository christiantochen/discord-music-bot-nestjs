import { Module } from '@nestjs/common';
import { HelpCommand } from './help.command';
import { MusicPlayerSlashCommandModule } from './musicPlayer';
import { StatsCommand } from './stats.command';

@Module({
  imports: [MusicPlayerSlashCommandModule],
  providers: [HelpCommand, StatsCommand],
})
export class SlashCommandModule {}
