import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { BotOptions } from './bot.options';
import * as providers from './providers';
import { BotSlashCommandModule } from './slashCommands';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useClass: BotOptions,
    }),
    BotSlashCommandModule,
  ],
  providers: [BotGateway, ...Object.values(providers)],
})
export class BotModule {}
