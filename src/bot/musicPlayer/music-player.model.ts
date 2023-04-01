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

export type LoopMode = 'off' | 'current' | 'all';

export class MusicPlayer extends AudioPlayer {
  private channel: TextChannel | undefined;
  private voiceChannel: VoiceChannel | undefined;
  private connection: VoiceConnection | undefined;
  private timeout: NodeJS.Timeout | undefined;
  private idleTimer = 60000;

  protected stopCalled = false;
  protected stream: YouTubeStream;

  public tracks: YouTubeVideo[] = [];
  public trackAt = 1;
  public loop: LoopMode = 'off';

  constructor(
    private readonly guild: Guild,
    options?: CreateAudioPlayerOptions,
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

  onPlay() {
    if (this.hasTimeout()) {
      this.clearTimeout();
    }
  }

  async onIdle(): Promise<void> {
    if (!this.connection) return;
    if (this.stopCalled) return this.setTimeout();

    // next track

    return this.setTimeout();
  }

  public override async play(metadata: any): Promise<void> {
    if (!(metadata instanceof YouTubeVideo)) return;

    const audioStream = await stream(metadata.url, { quality: 0 });
    const audioResource = createAudioResource(audioStream.stream, {
      inputType: audioStream.type,
      metadata,
    });

    return super.play(audioResource);
  }

  public override stop(force?: boolean | undefined): boolean {
    this.stopCalled = true;
    return super.stop(force);
  }

  public getCurrentTrack(): YouTubeVideo {
    return this.tracks[this.trackAt - 1];
  }

  public IsConnectedToVoiceChannel() {
    return !!this.voiceChannel;
  }
}
