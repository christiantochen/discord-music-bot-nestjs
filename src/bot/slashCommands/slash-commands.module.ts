import { Module } from '@nestjs/common';
import { HelpCommand } from './help.command';
import { MusicPlayerSlashCommandModule } from './musicPlayer';
import { PingCommand } from './ping.command';

@Module({
  imports: [MusicPlayerSlashCommandModule],
  providers: [HelpCommand, PingCommand],
})
export class SlashCommandModule {}
