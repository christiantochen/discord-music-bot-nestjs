import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { EmbedService } from '../../providers';
import {
  MemberInSameVoiceChannelGuard,
  MemberInVoiceChannelGuard,
} from 'src/bot/guards';
import { MusicPlayerService } from 'src/bot/musicPlayers';

@Command({
  name: 'leave',
  description: 'Bot will leave voice channel.',
})
export class LeaveCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard, MemberInSameVoiceChannelGuard)
  async handler(interaction: CommandInteraction): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);
    const message = EmbedService.create({ description: 'Time to clean up.' });

    await player.disconnect();

    interaction.reply({ embeds: [message] });
  }
}
