import { Module } from '@nestjs/common';
import { JoinCommand } from './join.command';
import { LeaveCommand } from './leave.command';

@Module({
  providers: [JoinCommand, LeaveCommand],
})
export class BotMusicPlayerSlashCommandModule {}
