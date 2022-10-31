import {
  AudioPlayer,
  AudioPlayerStatus,
  CreateAudioPlayerOptions,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import { Guild, TextChannel, VoiceChannel } from 'discord.js';
import { stream, YouTubeStream, YouTubeVideo } from 'play-dl';
import { EmbedService } from '../providers';

export type LoopMode = 'off' | 'current' | 'all';

export class MusicPlayer extends AudioPlayer {
  private channel: TextChannel | undefined;
  private voiceChannel: VoiceChannel | undefined;
  private connection: VoiceConnection | undefined;
  private timeout: NodeJS.Timeout | undefined;
  private stopCalled = false;
  private tracks: YouTubeVideo[] = [];
  private stream: YouTubeStream;

  public trackAt = 1;
  public autoPlay = false;
  public loop: LoopMode = 'off';

  constructor(
    private readonly guild: Guild,
    options?: CreateAudioPlayerOptions,
    private readonly idleTimer: number = 60000,
  ) {
    super(options);
    this.on(AudioPlayerStatus.Playing, () => this.onPlay());
    this.on(AudioPlayerStatus.Idle, () => this.onIdle());
  }

  public connect(voiceChannel: VoiceChannel, memberChannel: TextChannel) {
    if (this.voiceChannel && this.voiceChannel.id === voiceChannel.id) return;

    this.channel = memberChannel;
    this.voiceChannel = voiceChannel;
    this.connection = joinVoiceChannel({
      guildId: this.guild.id,
      channelId: this.voiceChannel.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    this.connection.subscribe(this);

    return this.setTimeout();
  }

  public disconnect(): void {
    this.connection?.destroy();
    this.connection = undefined;
    this.voiceChannel = undefined;
  }

  public async add(track: YouTubeVideo): Promise<void> {
    this.tracks.push(track);

    if (this.state.status === AudioPlayerStatus.Idle) {
      this.trackAt = this.tracks.length;
      await this.play(track);
    }
  }

  public remove(trackNo: number, count = 1): YouTubeVideo[] {
    if (trackNo < 1 || trackNo > this.tracks.length || trackNo === this.trackAt)
      return [];

    const removedTracks = this.tracks.splice(trackNo - 1, count);
    return removedTracks;
  }

  public async next(): Promise<boolean> {
    if (this.tracks.length < this.trackAt) return false;

    this.trackAt++;
    await this.play(this.tracks[this.trackAt - 1]);

    return true;
  }

  public async previous(): Promise<boolean> {
    if (this.trackAt <= 1) return false;

    this.trackAt--;
    await this.play(this.tracks[this.trackAt - 1]);

    return true;
  }

  public async skip(trackNo: number) {
    if (trackNo < 1 || trackNo > this.tracks.length || trackNo === this.trackAt)
      return false;

    this.trackAt = trackNo;
    await this.play(this.tracks[this.trackAt - 1]);
    return true;
  }

  public setTimeout() {
    if (!this.timeout) {
      this.stopCalled = false;
      this.timeout = setTimeout(() => this.disconnect(), this.idleTimer);
    }
  }

  public clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }

  public hasTimeout() {
    return !!this.timeout;
  }

  public IsConnectedToVoiceChannel() {
    return !!this.voiceChannel;
  }

  public getTracks() {
    return this.tracks;
  }

  public getCurrentTrack() {
    return this.tracks[this.trackAt - 1];
  }

  public override stop(force?: boolean | undefined): boolean {
    this.stopCalled = true;
    return super.stop(force);
  }

  public override async play(metadata: any): Promise<boolean> {
    if (!(metadata instanceof YouTubeVideo)) return false;

    const audioStream = await stream(metadata.url, { quality: 0 });
    const audioResource = createAudioResource(audioStream.stream, {
      inputType: audioStream.type,
      metadata,
    });
    super.play(audioResource);
    return true;
  }

  private onPlay() {
    this.clearTimeout();
  }

  private async onIdle(): Promise<void> {
    if (!this.connection) return;
    if (this.stopCalled) return this.setTimeout();

    let track;

    if (this.loop === 'current') {
      track = this.tracks[this.trackAt - 1];
      await this.play(track);
    } else {
      if (await this.next()) {
        track = this.tracks[this.trackAt - 1];
      }
    }

    if (track) {
      const lastMessage = this.channel.messages.cache.find(
        (m) => m.author.id === this.guild.client.user.id,
      );
      if (lastMessage.editable) {
        lastMessage.edit({ embeds: [EmbedService.createNowPlaying(track)] });
      }

      return;
    }

    return this.setTimeout();
  }
}
