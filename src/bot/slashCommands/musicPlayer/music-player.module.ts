import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { JoinCommand } from './join.command';
import { LeaveCommand } from './leave.command';
import { PlayCommand } from './play';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [JoinCommand, LeaveCommand, PlayCommand],
})
export class BotMusicPlayerSlashCommandModule {}
