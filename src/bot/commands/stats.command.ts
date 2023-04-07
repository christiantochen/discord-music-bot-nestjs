import { Command, DiscordCommand } from '@discord-nestjs/core';
import { CommandInteraction, version as djsVersion } from 'discord.js';
import { EmbedHelper } from '../helpers';

import { loadavg, cpus, freemem, totalmem } from 'os';

export const tokB = (bytes) => bytes / 1024;
export const toMB = (bytes) => tokB(bytes) / 1024;
export const toGB = (bytes) => toMB(bytes) / 1024;

@Command({
  name: 'stats',
  description: 'Bot Stats.',
})
export class StatsCommand implements DiscordCommand {
  handler(interaction: CommandInteraction): void {
    const cpuUsage = (loadavg()[0] / cpus().length).toFixed(2);
    const memUsage = Math.floor(toMB(process.memoryUsage().rss));
    const memUsageTotal = Math.floor(toMB(totalmem() - freemem()));
    const statsEmbed = EmbedHelper.create({ title: 'Stats' });

    interaction.reply({
      embeds: [
        statsEmbed.addFields(
          {
            name: ':fire: CPU usage',
            value: `**${cpuUsage}%**`,
            inline: true,
          },
          {
            name: ':level_slider: Memory',
            value: `**${memUsage}/${memUsageTotal}M**`,
            inline: true,
          },
          {
            name: ':clock2: Uptime',
            value: `**Started <t:${Math.floor(
              (Date.now() - interaction.client.uptime) / 1000,
            )}:R>**`,
            inline: true,
          },
          {
            name: ':red_circle: Latency',
            value: `**${Math.ceil(interaction.client.ws.ping)}ms**`,
            inline: true,
          },
          {
            name: ':incoming_envelope: Discord.js',
            value: `**v${djsVersion}**`,
            inline: true,
          },
          {
            name: ':white_check_mark: Node.js',
            value: `**${process.version}**`,
            inline: true,
          },
        ),
      ],
    });
  }
}
