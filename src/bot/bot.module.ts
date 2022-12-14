import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { BotOptions } from './bot.options';
import { MusicPlayerGateway } from './musicPlayers';
import * as providers from './providers';
import { SlashCommandModule } from './slashCommands';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useClass: BotOptions,
    }),
    SlashCommandModule,
  ],
  providers: [BotGateway, MusicPlayerGateway, ...Object.values(providers)],
})
export class BotModule {}
