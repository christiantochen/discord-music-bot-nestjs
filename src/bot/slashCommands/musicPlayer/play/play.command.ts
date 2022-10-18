import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core';
import { EmbedService } from '../../../providers';
import {
  MemberInSameVoiceChannelGuard,
  MemberInVoiceChannelGuard,
} from 'src/bot/guards';
import { MusicPlayerService } from 'src/bot/musicPlayers';
import { YoutubeService } from 'src/shared/music/services';
import { TransformPipe } from '@discord-nestjs/common';
import { PlayDto } from './play.dto';

@Command({
  name: 'play',
  description:
    'Search for a track on YouTube and add the first one on the search list to track.',
})
@UsePipes(TransformPipe)
export class PlayCommand implements DiscordTransformedCommand<PlayDto> {
  constructor(private readonly youtubeService: YoutubeService) {}

  @UseGuards(MemberInVoiceChannelGuard)
  @UseGuards(MemberInSameVoiceChannelGuard)
  async handler(
    @Payload() dto: PlayDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);

    const message = EmbedService.create({
      description: 'In development.',
    });

    interaction.reply({ embeds: [message] });
  }
}
