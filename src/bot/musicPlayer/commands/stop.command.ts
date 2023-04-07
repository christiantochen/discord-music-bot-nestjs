import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { EmbedHelper } from '../../helpers';
import {
  MemberInSameVoiceChannelGuard,
  MemberInVoiceChannelGuard,
} from 'src/bot/guards';
import { MusicPlayerService } from 'src/bot/musicPlayer';

@Command({
  name: 'stop',
  description: 'Stop the music player.',
})
export class StopCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard, MemberInSameVoiceChannelGuard)
  async handler(interaction: CommandInteraction): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);

    await player.stop();

    interaction.reply({
      embeds: [EmbedHelper.create({ description: 'Music stop' })],
    });
  }
}
