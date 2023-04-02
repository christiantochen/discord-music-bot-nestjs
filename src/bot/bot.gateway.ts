import { Injectable, Logger } from '@nestjs/common';
import { Once, InjectDiscordClient } from '@discord-nestjs/core';
import {
  ActionRowBuilder,
  ActivityType,
  Client,
  PresenceUpdateStatus,
  SelectMenuComponentOptionData,
  StringSelectMenuBuilder,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { EmbedService } from './providers';

const LOOP_SEQUENCES = ['🔁', '🔂', '🔀'];

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

    this.client.guilds.cache.forEach(async (guild) => {
      const channel = guild.channels.cache
        .filter((channel) => channel instanceof TextChannel)
        .first();

      const voiceChannels = guild.channels.cache.filter(
        (channel) => channel instanceof VoiceChannel,
      );

      console.log(
        voiceChannels.map((vc) => ({
          name: vc.name,
          id: vc.id,
        })),
      );

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
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('select')
              .setPlaceholder(`Select a song`)
              .addOptions(options),
          );

        const channelMessage = await channel.send({
          embeds: [message],
          components: [selector],
        });

        channelMessage.react('⏮️');
        channelMessage.react('▶️');
        channelMessage.react('⏹️');
        channelMessage.react('⏭️');
        channelMessage.react('🔁');
        channelMessage.react('🔀');
      }
    });
  }
}
