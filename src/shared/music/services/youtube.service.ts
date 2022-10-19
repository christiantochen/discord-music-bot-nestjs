import { AudioResource, createAudioResource } from '@discordjs/voice';
import {
  YouTubeVideo,
  validate,
  video_basic_info,
  search,
  stream,
} from 'play-dl';

export class YoutubeService {
  private searchVideoYT(query: string, limit = 1): Promise<YouTubeVideo[]> {
    return search(query, {
      source: { youtube: 'video' },
      limit,
      fuzzy: true,
    });
  }

  async findAll(query: string): Promise<YouTubeVideo[]> {
    const validateResult = await validate(query);

    if (validateResult !== 'search') return [];

    return this.searchVideoYT(query, 5);
  }

  async findOne(query: string): Promise<YouTubeVideo | undefined> {
    const validateResult = await validate(query);

    if (!validateResult) return;

    let video: YouTubeVideo;

    switch (validateResult) {
      case 'search': {
        const videoResult = await this.searchVideoYT(query);
        video = videoResult[0];
        break;
      }
      case 'yt_video': {
        const videoInfo = await video_basic_info(query);
        video = videoInfo.video_details;
        break;
      }
      default:
        break;
    }

    return video;
  }

  createAudio = async (
    metadata: YouTubeVideo | any,
  ): Promise<AudioResource<any>> => {
    const audioStream = await stream(metadata.url, { quality: 0 });

    return createAudioResource(audioStream.stream, {
      inputType: audioStream.type,
      metadata,
    });
  };
}
