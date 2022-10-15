import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import {
  CommandInteraction,
  GuildMember,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { Injectable } from '@nestjs/common';
import { EmbedService } from '../../providers';
import { MemberInVoiceChannelGuard } from 'src/bot/guards';

@Command({
  name: 'join',
  description: 'Bot will join voice channel.',
})
@Injectable()
export class JoinCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard)
  handler(interaction: CommandInteraction): void {
    interaction.reply({
      embeds: [
        EmbedService.create({ description: 'Ohhh, how exciting! Ahem.' }),
      ],
    });
  }
}
