import { InteractionEventCollector, On, Once } from '@discord-nestjs/core';
import { ButtonInteraction, SelectMenuInteraction } from 'discord.js';
import { YoutubeService } from 'src/shared/music/services';
import { EmbedHelper } from '../helpers';
import { MusicPlayerService } from './music-player.service';
import { MusicPlayerActions } from './music-player.action';

@InteractionEventCollector({ time: 15000 })
export class MusicPlayerInteractionCollector {
  constructor(private readonly youtubeService: YoutubeService) {}

  @On('collect')
  async onCollect(
    interaction: ButtonInteraction | SelectMenuInteraction,
  ): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === 'selectTrack'
    ) {
      await interaction.deferUpdate();
      const url = interaction.values[0];
      const track = await this.youtubeService.findOne(url);

      MusicPlayerActions.Add(player, track);

      const nowPlaying = player.trackAt === player.tracks.length;

      if (nowPlaying) {
        MusicPlayerActions.Play(player);
      }

      const payload = EmbedHelper.createPayload(interaction, track, nowPlaying);

      await interaction.editReply(payload);
      return;
    }

    if (interaction.isButton()) {
      switch (interaction.customId) {
        case 'next':
        case 'previous':
        case 'pause':
        case 'resume':
        case 'play':
        case 'goto':
        default:
          await interaction.editReply({
            content: `Button Interaction with id '${interaction.customId}' not found`,
          });
          break;
      }
    }

    await interaction.editReply({ content: 'Invalid Interaction' });
  }

  @Once('end')
  onEnd(): void {
    console.log('end');
  }
}
