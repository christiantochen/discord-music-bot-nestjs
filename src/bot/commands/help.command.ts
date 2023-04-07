import { Command, DiscordCommand } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { EmbedHelper } from '../helpers';

@Command({
  name: 'help',
  description: 'Display default information.',
})
export class HelpCommand implements DiscordCommand {
  handler(interaction: CommandInteraction): void {
    const message = EmbedHelper.create({ description: `Not Implemented Yet` });

    interaction.reply({ embeds: [message] });
  }
}
