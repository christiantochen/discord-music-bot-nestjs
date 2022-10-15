import { APIEmbed, EmbedBuilder, EmbedData } from 'discord.js';

export class EmbedService {
  public static create(data?: EmbedData | APIEmbed) {
    return new EmbedBuilder(data).setColor(0x00adff);
  }
}
