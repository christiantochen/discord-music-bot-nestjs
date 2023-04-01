import { Module } from '@nestjs/common';
import {
  JoinCommand,
  LeaveCommand,
  NextCommand,
  PlayCommand,
  PrevCommand,
  ShowCommand,
  StopCommand,
} from './commands';
import { DiscordModule } from '@discord-nestjs/core';
import { MusicPlayerGateway } from './music-player.gateway';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [
    MusicPlayerGateway,
    JoinCommand,
    LeaveCommand,
    PlayCommand,
    ShowCommand,
    NextCommand,
    PrevCommand,
    StopCommand,
  ],
})
export class MusicPlayerModule {}
