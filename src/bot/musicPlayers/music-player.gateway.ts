import { Injectable, Logger } from '@nestjs/common';
import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, VoiceState } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { MusicPlayerService } from './music-player.service';

@Injectable()
export class MusicPlayerGateway {
  private readonly logger = new Logger(MusicPlayerGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @On('voiceStateUpdate')
  async onVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState,
  ): Promise<void> {
    if (!newState.member.voice.channel) {
      this.logger.log('someone disconnected');

      if (newState.member.user.id === this.client.user.id) {
        this.logger.log('bot removed from voice channel');
        MusicPlayerService.Delete(newState.member.guild);
        return;
      }

      if (
        oldState.channel.members.size === 1 &&
        oldState.channel.members.first().user.id === this.client.user.id
      ) {
        this.logger.log('last member is bot, set timeout');
        MusicPlayerService.Get(oldState.member.guild)?.setTimeout();
        return;
      }

      return;
    }

    this.logger.log('someone connected');
    const player = MusicPlayerService.Get(newState.member.guild);

    if (
      newState.channel.members.size > 1 &&
      player &&
      player.hasTimeout() &&
      player.state.status === AudioPlayerStatus.Playing
    ) {
      this.logger.log('clear timeout');
      player?.clearTimeout();
    }
  }
}
