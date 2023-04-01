import { CreateAudioPlayerOptions } from '@discordjs/voice';
import { Collection, Guild } from 'discord.js';
import { MusicPlayer } from './music-player.model';

export class MusicPlayerService {
  private static musicPlayers = new Collection<string, MusicPlayer>();

  public static Get(guild: Guild) {
    return this.musicPlayers.get(guild.id);
  }

  public static Create(guild: Guild, options?: CreateAudioPlayerOptions) {
    const player = new MusicPlayer(guild, options);
    this.musicPlayers.set(guild.id, player);
    return player;
  }

  public static GetOrCreate(guild: Guild, options?: CreateAudioPlayerOptions) {
    return this.Get(guild) ?? this.Create(guild, options);
  }

  public static Delete(guild: Guild) {
    return this.musicPlayers.delete(guild.id);
  }
}
