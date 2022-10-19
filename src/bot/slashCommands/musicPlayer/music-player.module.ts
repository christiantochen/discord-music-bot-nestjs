import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { JoinCommand } from './join.command';
import { LeaveCommand } from './leave.command';
import { NextCommand } from './next.command';
import { PlayCommand } from './play';
import { PrevCommand } from './prev.command';
import { ShowCommand } from './show.command';
import { StopCommand } from './stop.command';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [
    JoinCommand,
    LeaveCommand,
    PlayCommand,
    ShowCommand,
    NextCommand,
    PrevCommand,
    StopCommand,
  ],
})
export class MusicPlayerSlashCommandModule {}
