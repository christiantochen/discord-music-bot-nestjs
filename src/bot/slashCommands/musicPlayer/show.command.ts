import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { EmbedService } from '../../providers';
import {
  MemberInSameVoiceChannelGuard,
  MemberInVoiceChannelGuard,
} from 'src/bot/guards';
import { MusicPlayerService } from 'src/bot/musicPlayers';

@Command({
  name: 'show',
  description: 'Display the queue of the current tracks.',
})
export class ShowCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard, MemberInSameVoiceChannelGuard)
  async handler(interaction: CommandInteraction): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);

    const message = EmbedService.showTracks(
      player.getTracks(),
      player.trackAt,
      1,
    );

    interaction.reply({ embeds: [message] });
  }
}
