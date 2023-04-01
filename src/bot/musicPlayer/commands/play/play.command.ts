import { TransformPipe } from '@discord-nestjs/common';
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UseCollectors,
  UsePipes,
} from '@discord-nestjs/core';
import { Logger } from '@nestjs/common';
import {
  ActionRowBuilder,
  GuildMember,
  InteractionReplyOptions,
  StringSelectMenuBuilder,
  SelectMenuComponentOptionData,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { MusicPlayerService } from 'src/bot/musicPlayer';
import { YoutubeService } from 'src/shared/music/services';
import { PlayDto } from './play.dto';
import { MusicPlayerInteractionCollector } from '../../music-player.collector';

@Command({
  name: 'play',
  description:
    'Search for a track on YouTube and add the first one on the search list to track.',
})
@UseCollectors(MusicPlayerInteractionCollector)
@UsePipes(TransformPipe)
export class PlayCommand implements DiscordTransformedCommand<PlayDto> {
  private readonly logger = new Logger(PlayCommand.name);

  constructor(private readonly youtubeService: YoutubeService) {}

  async handler(
    @Payload() dto: PlayDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<InteractionReplyOptions> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);
    const metadata = await this.youtubeService.findAll(dto.song);
    const member = interaction.member as GuildMember;
    const memberChannel = interaction.channel as TextChannel;
    const voiceChannel = member.voice.channel as VoiceChannel;

    if (!player.IsConnectedToVoiceChannel()) {
      await player.connect(voiceChannel, memberChannel);
    }

    const options: SelectMenuComponentOptionData[] = metadata.map((track) => ({
      label: `${track.title}`,
      description: `by ${track.channel.name} [${track.durationRaw}]`,
      value: track.id,
    }));

    const selector =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('selectSong')
          .setPlaceholder(`Select a song`)
          .addOptions(options),
      );

    return {
      components: [selector],
    };
  }
}
