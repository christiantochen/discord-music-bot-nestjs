import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { EmbedService } from '../../providers';
import {
  MemberInSameVoiceChannelGuard,
  MemberInVoiceChannelGuard,
} from 'src/bot/guards';
import { MusicPlayerActions, MusicPlayerService } from 'src/bot/musicPlayer';

@Command({
  name: 'prev',
  description: 'Skip and play previous song from playlist.',
})
export class PrevCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard, MemberInSameVoiceChannelGuard)
  async handler(interaction: CommandInteraction): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);

    if (await MusicPlayerActions.Previous(player)) {
      const track = player.getCurrentTrack();

      interaction.reply({ embeds: [EmbedService.createNowPlaying(track)] });
      return;
    }

    interaction.reply({
      embeds: [EmbedService.create({ description: 'This is the first track' })],
    });
  }
}
