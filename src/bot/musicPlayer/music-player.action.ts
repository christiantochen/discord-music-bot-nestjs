import { YouTubeVideo } from 'play-dl';
import { MusicPlayer } from './music-player.model';
import { AudioPlayerStatus } from '@discordjs/voice';

export class MusicPlayerActions {
  static async Play(musicPlayer: MusicPlayer): Promise<void> {
    if (musicPlayer.state.status !== AudioPlayerStatus.Playing) {
      await musicPlayer.play(musicPlayer.getCurrentTrack());
    }
  }

  static async Add(
    musicPlayer: MusicPlayer,
    track: YouTubeVideo,
  ): Promise<void> {
    musicPlayer.tracks.push(track);
  }

  static Remove(
    musicPlayer: MusicPlayer,
    trackNo: number,
    count = 1,
  ): YouTubeVideo[] {
    if (
      trackNo < 1 ||
      trackNo === musicPlayer.trackAt ||
      trackNo + count - 1 > musicPlayer.tracks.length
    )
      return [];

    const removedTracks = musicPlayer.tracks.splice(trackNo - 1, count);
    return removedTracks;
  }

  static async Next(musicPlayer: MusicPlayer) {
    if (musicPlayer.tracks.length < musicPlayer.trackAt) return false;

    musicPlayer.trackAt++;
    await musicPlayer.play(musicPlayer.getCurrentTrack());

    return true;
  }

  static async Previous(musicPlayer: MusicPlayer): Promise<boolean> {
    if (musicPlayer.trackAt <= 1) return false;

    musicPlayer.trackAt--;
    await musicPlayer.play(musicPlayer.getCurrentTrack());

    return true;
  }

  static async SkipTo(musicPlayer: MusicPlayer, trackNo: number) {
    if (trackNo < 1 || trackNo > musicPlayer.tracks.length) return false;
    if (
      trackNo === musicPlayer.trackAt &&
      musicPlayer.state.status === AudioPlayerStatus.Playing
    )
      return false;

    musicPlayer.trackAt = trackNo;
    await musicPlayer.play(musicPlayer.getCurrentTrack());
    return true;
  }
}
