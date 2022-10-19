import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core';
import {
  MemberInSameVoiceChannelGuard,
  MemberInVoiceChannelGuard,
} from 'src/bot/guards';
import { YoutubeService } from 'src/shared/music/services';
import { TransformPipe } from '@discord-nestjs/common';
import { PlayDto } from './play.dto';
import {
  ActionRowBuilder,
  ComponentType,
  SelectMenuBuilder,
  SelectMenuComponentOptionData,
} from 'discord.js';
import { MusicPlayerService } from 'src/bot/musicPlayers';
import { Logger } from '@nestjs/common';
import { EmbedService } from 'src/bot/providers';

@Command({
  name: 'play',
  description:
    'Search for a track on YouTube and add the first one on the search list to track.',
})
@UsePipes(TransformPipe)
export class PlayCommand implements DiscordTransformedCommand<PlayDto> {
  private readonly logger = new Logger(PlayCommand.name);

  constructor(private readonly youtubeService: YoutubeService) {}

  @UseGuards(MemberInVoiceChannelGuard, MemberInSameVoiceChannelGuard)
  async handler(
    @Payload() dto: PlayDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<void> {
    const metadata = await this.youtubeService.findAll(dto.song);

    const options: SelectMenuComponentOptionData[] = metadata.map((track) => ({
      label: `${track.title}`,
      description: `by ${track.channel.name} [${track.durationRaw}]`,
      value: track.id,
    }));

    const selector = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder('Nothing selected')
        .addOptions(options),
    );

    const selectSong = await interaction.reply({
      components: [selector],
    });

    selectSong
      .awaitMessageComponent({
        componentType: ComponentType.SelectMenu,
        idle: 15000,
      })
      .then(async (interaction) => {
        await interaction.deferUpdate();

        const id = interaction.values[0];
        const track = metadata.find((track) => track.id === id);
        const player = MusicPlayerService.GetOrCreate(interaction.guild);

        await player.add(track);
        let message = EmbedService.createNowPlaying(track);

        if (player.trackAt !== player.getTracks().length) {
          message = EmbedService.createAddedToTrack(
            player.getTracks().length,
            track,
          );
        }

        await interaction.editReply({
          embeds: [message],
          components: [],
        });
      })
      .catch((e) => this.logger.log(e.message));
  }
}
