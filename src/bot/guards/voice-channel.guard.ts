import { DiscordGuard } from '@discord-nestjs/core';
import { CommandInteraction, GuildMember } from 'discord.js';
import { EmbedHelper } from '../helpers';

export class MemberInVoiceChannelGuard implements DiscordGuard {
  async canActive(
    event: 'interactionCreate',
    [interaction]: [CommandInteraction],
  ): Promise<boolean> {
    const member = interaction.member as GuildMember;

    if (member.voice.channelId) return true;

    if (interaction.isRepliable()) {
      await interaction.reply({
        embeds: [
          EmbedHelper.create({ description: 'Please join a voice channel!' }),
        ],
      });
    }

    return false;
  }
}

export class MemberInSameVoiceChannelGuard implements DiscordGuard {
  async canActive(
    event: 'interactionCreate',
    [interaction]: [CommandInteraction],
  ): Promise<boolean> {
    const member = interaction.member as GuildMember;
    const bot = interaction.guild?.members.me;
    let message: string;

    if (!bot?.voice.channelId) {
      message = 'Bot has yet join any voice channel!';
    }

    if (member.voice.channelId !== bot?.voice.channelId) {
      message =
        'You need to be in the same voice channel with me to execute this command!';
    }

    if (message) {
      if (interaction.isRepliable()) {
        await interaction.reply({
          embeds: [EmbedHelper.create({ description: message })],
        });
      }

      return false;
    }

    return true;
  }
}
