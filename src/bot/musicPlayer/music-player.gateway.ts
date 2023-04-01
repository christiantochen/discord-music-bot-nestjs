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
    // if a member disconnected from voice channel
    if (!newState.member.voice.channel) {
      this.logger.log(`${newState.member.displayName} disconnected`);

      // if the member is bot
      if (newState.member.user.id === this.client.user.id) {
        this.logger.log(
          `${newState.member.displayName} removed from voice channel`,
        );
        MusicPlayerService.Delete(newState.member.guild);
        return;
      }

      // if only 1 member left and it is bot
      if (
        oldState.channel.members.size === 1 &&
        oldState.channel.members.first().user.id === this.client.user.id
      ) {
        this.logger.log('set timeout');
        MusicPlayerService.Get(oldState.member.guild)?.setTimeout();
        return;
      }

      return;
    }

    this.logger.log(`${newState.member.displayName} connected`);
    if (newState.channel.members.size <= 1) return;

    // if total members more than 1
    // and player is playing music
    // and player has timeout
    // then clear the timeout
    const player = MusicPlayerService.Get(newState.member.guild);
    if (
      player &&
      player.state.status === AudioPlayerStatus.Playing &&
      player.hasTimeout()
    ) {
      this.logger.log('clear timeout');
      player?.clearTimeout();
    }
  }
}
