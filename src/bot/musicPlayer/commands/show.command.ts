import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { EmbedHelper } from '../../helpers';
import {
  MemberInSameVoiceChannelGuard,
  MemberInVoiceChannelGuard,
} from 'src/bot/guards';
import { MusicPlayerService } from 'src/bot/musicPlayer';

@Command({
  name: 'show',
  description: 'Display the queue of the current tracks.',
})
export class ShowCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard, MemberInSameVoiceChannelGuard)
  async handler(interaction: CommandInteraction): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);

    const message = EmbedHelper.showTracks(player.tracks, player.trackAt, 1);

    interaction.reply({ embeds: [message] });
  }
}
