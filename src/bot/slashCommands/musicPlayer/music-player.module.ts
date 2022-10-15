import { Module } from '@nestjs/common';
import { JoinCommand } from './join.command';

@Module({
  providers: [JoinCommand],
})
export class BotMusicPlayerSlashCommandModule {}
