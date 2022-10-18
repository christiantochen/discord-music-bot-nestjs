import { Injectable } from '@nestjs/common';
import {
  DiscordModuleOption,
  DiscordOptionsFactory,
} from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotOptions implements DiscordOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createDiscordOptions(): DiscordModuleOption {
    return {
      token: this.configService.get('discord.bot.token'),
      discordClientOptions: {
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildPresences,
          GatewayIntentBits.GuildVoiceStates,
        ],
      },
      failOnLogin: true,
      registerCommandOptions: [
        {
          forGuild: this.configService.get('discord.client_id'),
          removeCommandsBefore: true,
        },
      ],
    };
  }
}
