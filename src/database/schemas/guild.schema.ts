import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTimestampsConfig } from 'mongoose';

@Schema({ timestamps: true })
export class GuildEntity {
  @Prop({ type: String, unique: true, index: true, required: true })
  id: string;

  @Prop({ type: String, index: true, required: true })
  name: string;

  @Prop({ type: String, index: true, required: true })
  ownerId: string;

  @Prop({ type: Number, required: true, default: 0 })
  memberCount: number;

  @Prop({ type: String, required: true })
  preferredLocale: string;

  @Prop({ type: String })
  afkChannelId: string;

  @Prop({ type: String, index: true })
  musicTextChannelId: string;

  @Prop({ type: String, index: true })
  musicVoiceChannelId: string;

  @Prop({ type: String })
  publicUpdatesChannelId: string;

  @Prop({ type: String })
  rulesChannelId: string;

  @Prop({ type: String })
  systemChannelId: string;
}

export type GuildDocument = GuildEntity & Document & SchemaTimestampsConfig;

export const GuildModel = {
  name: GuildEntity.name,
  schema: SchemaFactory.createForClass(GuildEntity),
  collection: 'guilds',
};
