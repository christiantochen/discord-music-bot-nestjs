import { InteractionEventCollector, On, Once } from '@discord-nestjs/core';
import { ButtonInteraction, SelectMenuInteraction } from 'discord.js';
import { YoutubeService } from 'src/shared/music/services';
import { MusicPlayerService } from '../../musicPlayers';
import { EmbedService } from '../../providers';

@InteractionEventCollector({ time: 15000 })
export class MusicPlayerInteractionCollector {
  constructor(private readonly youtubeService: YoutubeService) {}

  @On('collect')
  async onCollect(
    interaction: ButtonInteraction | SelectMenuInteraction,
  ): Promise<void> {
    const player = MusicPlayerService.GetOrCreate(interaction.guild);

    if (interaction.isSelectMenu() && interaction.customId === 'selectSong') {
      await interaction.deferUpdate();
      const url = interaction.values[0];
      const track = await this.youtubeService.findOne(url);

      player.add(track);

      const payload = EmbedService.createPayload(
        interaction,
        track,
        player.trackAt === player.getTracks().length,
      );

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
