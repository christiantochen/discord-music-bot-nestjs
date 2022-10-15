import { YouTubeVideo, validate, video_basic_info, search } from 'play-dl';

export class YoutubeService {
  private searchVideoYT(query: string): Promise<YouTubeVideo[]> {
    return search(query, {
      source: { youtube: 'video' },
      limit: 1,
    });
  }

  async findAll(query: string): Promise<YouTubeVideo[]> {
    const validateResult = await validate(query);

    if (validateResult !== 'search') return [];

    return this.searchVideoYT(query);
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
}
