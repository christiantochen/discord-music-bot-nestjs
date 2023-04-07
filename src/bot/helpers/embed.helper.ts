import {
  APIEmbed,
  EmbedBuilder,
  EmbedData,
  Interaction,
  MessagePayload,
} from 'discord.js';
import { YouTubeVideo } from 'play-dl';

export class EmbedHelper {
  private static transformTitle(track: YouTubeVideo) {
    return `[${track.title}](${track.url}) by [${track.channel.name}](${track.channel.url}) [${track.durationRaw}]`;
  }

  public static create(data?: EmbedData | APIEmbed) {
    return new EmbedBuilder(data).setColor(0x00adff);
  }

  public static createPayload(
    interaction: Interaction,
    track: YouTubeVideo,
    nowPlaying: boolean,
  ) {
    const message = nowPlaying
      ? this.createNowPlaying(track)
      : this.createAddedToTrack(track);

    const payload = new MessagePayload(interaction, {
      embeds: [message],
      components: [],
    });

    return payload;
  }

  public static createNowPlaying(track: YouTubeVideo) {
    return EmbedHelper.create({
      fields: [
        {
          name: 'NOW PLAYING',
          value: this.transformTitle(track),
        },
      ],
    });
  }

  public static createAddedToTrack(track: YouTubeVideo) {
    return EmbedHelper.create({
      fields: [
        {
          name: `New track added`,
          value: this.transformTitle(track),
        },
      ],
    });
  }

  private static parseMetadata = (track: any) =>
    `[${track.title}](${track.url}) by [${track.channel.name}](${track.channel.url}) [${track.durationRaw}]`;

  public static showTracks(
    tracks: YouTubeVideo[],
    trackAt: number,
    targetPage = 1,
  ) {
    const totalPage = Math.ceil(tracks.length / 5);
    const pageLimit = 5;

    const currentPage =
      targetPage ?? (trackAt > 0 ? Math.ceil(trackAt / pageLimit) : 1);
    const trackStart = currentPage * pageLimit - pageLimit + 1;
    const tracklist = tracks
      .slice(trackStart - 1, trackStart - 1 + pageLimit)
      .map((track, index) => {
        let message = this.parseMetadata(track);

        if (trackStart - 1 + index === trackAt - 1) message = `*${message}*`;

        return `**${trackStart + index}.**\t${message}`;
      });

    let description;

    if (tracklist.length > 0)
      description = tracklist.reduce((prev, current) => `${prev}\n${current}`);

    const message = this.create()
      .addFields({
        name: 'TRACK LIST',
        value: description ?? 'No queue at the moment',
      })
      .setFooter({
        text: `Pages: ${currentPage}/${totalPage} | Loop Mode: ${true} | Total: ${
          tracks.length
        }`,
      });

    return message;
  }
}
