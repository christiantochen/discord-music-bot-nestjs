import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import {
  CommandInteraction,
  GuildMember,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { EmbedService } from '../../providers';
import { MemberInVoiceChannelGuard } from 'src/bot/guards';
import { MusicPlayerService } from 'src/bot/musicPlayers';

@Command({
  name: 'join',
  description: 'Bot will join voice channel.',
})
export class JoinCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard)
  async handler(interaction: CommandInteraction): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);
    const member = interaction.member as GuildMember;
    const memberChannel = interaction.channel as TextChannel;
    const voiceChannel = member.voice.channel as VoiceChannel;
    const message = EmbedService.create();

    if (!player.IsConnectedToVoiceChannel()) {
      await player.connect(voiceChannel, memberChannel);
      message.setDescription('Ohhh, how exciting! Ahem.');
    } else {
      message.setDescription(
        "You seem tired. Would you like some tea? I'll brew you some. Do you take sugar? One cube, or two?",
      );
    }

    interaction.reply({ embeds: [message] });
  }
}
