import { Injectable, Logger } from '@nestjs/common';
import { Once, InjectDiscordClient } from '@discord-nestjs/core';
import { ActivityType, Client, PresenceUpdateStatus } from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once('ready')
  async onReady() {
    await this.client.user?.setPresence({
      status: PresenceUpdateStatus.Online,
      activities: [
        {
          name: '/help',
          type: ActivityType.Listening,
        },
      ],
    });

    this.logger.log(`Bot ${this.client.user.tag} was started!`);
  }
}
