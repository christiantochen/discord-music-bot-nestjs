import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { EmbedService } from '../../providers';
import {
  MemberInSameVoiceChannelGuard,
  MemberInVoiceChannelGuard,
} from 'src/bot/guards';
import { MusicPlayerService } from 'src/bot/musicPlayers';
import { AudioPlayerStatus } from '@discordjs/voice';

@Command({
  name: 'show',
  description: 'Display the queue of the current tracks.',
})
export class ShowCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard, MemberInSameVoiceChannelGuard)
  async handler(interaction: CommandInteraction): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);

    const playlist = player.getTracks().reduce((prev: string, track, index) => {
      let title = `[${track.title}](${track.url}) by [${track.channel.name}](${track.channel.url}) [${track.durationRaw}]`;

      if (
        index === player.trackAt - 1 &&
        player.state.status === AudioPlayerStatus.Playing
      )
        title = `*${title}*`;

      title = `**${index + 1}.**\t${title}`;

      if (prev) title = `${prev}\n${title}`;

      return title;
    }, undefined);

    const message = EmbedService.create({
      description: playlist || 'No List',
    });

    interaction.reply({ embeds: [message] });
  }
}
