import { APIEmbed, EmbedBuilder, EmbedData } from 'discord.js';
import { YouTubeVideo } from 'play-dl';

export class EmbedService {
  private static transformTitle(track: YouTubeVideo) {
    return `[${track.title}](${track.url}) by [${track.channel.name}](${track.channel.url}) [${track.durationRaw}]`;
  }

  public static create(data?: EmbedData | APIEmbed) {
    return new EmbedBuilder(data).setColor(0x00adff);
  }

  public static createNowPlaying(track: YouTubeVideo) {
    return EmbedService.create({
      fields: [
        {
          name: 'NOW PLAYING',
          value: this.transformTitle(track),
        },
      ],
    });
  }

  public static createAddedToTrack(trackNo: number, track: YouTubeVideo) {
    return EmbedService.create({
      fields: [
        {
          name: `New track added at position #${trackNo}`,
          value: this.transformTitle(track),
        },
      ],
    });
  }
}
