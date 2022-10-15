import { Command, DiscordCommand } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { EmbedService } from '../../providers';

@Command({
  name: 'help',
  description: 'Display default information.',
})
@Injectable()
export class HelpCommand implements DiscordCommand {
  handler(interaction: CommandInteraction): void {
    const message = EmbedService.create({ description: `Not Implemented Yet` });

    interaction.reply({ embeds: [message] });
  }
}
