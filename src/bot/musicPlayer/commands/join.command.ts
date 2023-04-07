import { Command, DiscordCommand, UseGuards } from '@discord-nestjs/core';
import {
  CommandInteraction,
  GuildMember,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { EmbedHelper } from '../../helpers';
import { MemberInVoiceChannelGuard } from 'src/bot/guards';
import { MusicPlayerService } from 'src/bot/musicPlayer';

@Command({
  name: 'join',
  description: 'Bot will join voice channel.',
})
export class JoinCommand implements DiscordCommand {
  @UseGuards(MemberInVoiceChannelGuard)
  async handler(interaction: CommandInteraction): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);
    const member = interaction.member as GuildMember;
    const message = EmbedHelper.create();

    if (!player.IsConnectedToVoiceChannel()) {
      await player.connect(
        member.voice.channel as VoiceChannel,
        interaction.channel as TextChannel,
      );
      message.setDescription('Ohhh, how exciting! Ahem.');
    } else {
      message.setDescription(
        "You seem tired. Would you like some tea? I'll brew you some. Do you take sugar? One cube, or two?",
      );
    }

    interaction.reply({ embeds: [message] });
  }
}
