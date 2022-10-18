import {
  AudioPlayer,
  CreateAudioPlayerOptions,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import { Guild, TextChannel, VoiceChannel } from 'discord.js';

export class MusicPlayer extends AudioPlayer {
  channelId: string | undefined;
  voiceChannelId: string | undefined;

  private connection: VoiceConnection | undefined;
  private timeout: NodeJS.Timeout | undefined;
  private stopCalled = false;

  constructor(
    private readonly guild: Guild,
    options?: CreateAudioPlayerOptions,
    private readonly idleTimer: number = 60000,
  ) {
    super(options);
  }

  async connect(voiceChannel: VoiceChannel, memberChannel: TextChannel) {
    if (this.voiceChannelId && this.voiceChannelId === voiceChannel.id) return;

    this.channelId = memberChannel.id;
    this.voiceChannelId = voiceChannel.id;
    this.connection = joinVoiceChannel({
      guildId: this.guild.id,
      channelId: this.voiceChannelId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    this.connection.subscribe(this);

    return this.setTimeout();
  }

  disconnect(): void {
    this.connection?.destroy();
    this.connection = undefined;
    this.voiceChannelId = undefined;
  }

  setTimeout() {
    if (!this.timeout) {
      this.stopCalled = false;
      this.timeout = setTimeout(() => this.disconnect(), this.idleTimer);
    }
  }

  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }

  hasTimeout() {
    return this.timeout !== undefined;
  }
}
