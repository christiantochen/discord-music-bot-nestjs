import { Command, DiscordCommand } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { EmbedService } from '../providers';

@Command({
  name: 'ping',
  description: 'A check to see if `bot` is able to respond.',
})
export class PingCommand implements DiscordCommand {
  handler(interaction: CommandInteraction): void {
    const execTime = Math.abs(Date.now() - interaction.createdTimestamp);
    const apiLatency = Math.floor(interaction.client.ws.ping);

    interaction.reply({
      embeds: [
        EmbedService.create({
          fields: [
            {
              name: 'Command Execution Time',
              value: `${execTime}ms`,
            },
            {
              name: 'Discord API Latency',
              value: `${apiLatency}ms`,
            },
          ],
        }),
      ],
    });
  }
}
