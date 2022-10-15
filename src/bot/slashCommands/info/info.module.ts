import { Module } from '@nestjs/common';
import { HelpCommand } from './help.command';
import { PingCommand } from './ping.command';

@Module({
  providers: [HelpCommand, PingCommand],
})
export class BotInfoSlashCommandModule {}
