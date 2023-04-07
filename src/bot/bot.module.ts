import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { BotFactory } from './bot.factory';
import * as providers from './helpers';
import { MusicPlayerModule } from './musicPlayer/music-player.module';
import { HelpCommand, StatsCommand } from './commands';
import { DatabaseModule } from 'src/database';

@Module({
  imports: [
    DatabaseModule,
    DiscordModule.forRootAsync({
      useClass: BotFactory,
    }),
    MusicPlayerModule,
    HelpCommand,
    StatsCommand,
  ],
  providers: [BotGateway, ...Object.values(providers)],
})
export class BotModule {}
