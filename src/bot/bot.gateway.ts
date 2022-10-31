import { Injectable, Logger } from '@nestjs/common';
import {
  Once,
  InjectDiscordClient,
  PrefixCommand,
  UsePipes,
} from '@discord-nestjs/core';
import {
  ActionRowBuilder,
  ActivityType,
  Client,
  PresenceUpdateStatus,
  SelectMenuBuilder,
  SelectMenuComponentOptionData,
  TextChannel,
} from 'discord.js';
import { PrefixCommandTransformPipe } from '@discord-nestjs/common';
import { EmbedService } from './providers';

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

  @Once('ready')
  async Test() {
    console.log('masuk sini ga bro');

    this.client.guilds.cache.forEach((guild) => {
      const channel = guild.channels.cache
        .filter((channel) => channel instanceof TextChannel)
        .first();

      if (channel instanceof TextChannel) {
        const options: SelectMenuComponentOptionData[] = Array.from(
          Array(5).keys(),
        ).map((i) => ({
          label: `test`,
          description: `by test [1:12]`,
          value: `${i + 1}`,
        }));

        const tracklist = options
          .map(({ label, description }, index) => {
            let message = `${label} ${description}`;

            if (index === 0) message = `*${message}*`;

            return `**${index + 1}.**\t${message}`;
          })
          .reduce((prev, current) => `${prev}\n${current}`);

        const message = EmbedService.create({ description: tracklist });

        const selector =
          new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
              .setCustomId('select')
              .setPlaceholder(`Select a song`)
              .addOptions(options),
          );

        channel.send({ embeds: [message], components: [selector] });
      }
    });
  }
}
