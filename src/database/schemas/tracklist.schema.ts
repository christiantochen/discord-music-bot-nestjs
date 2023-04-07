import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTimestampsConfig, Types } from 'mongoose';
import { GuildDocument } from './guild.schema';

@Schema({ timestamps: true })
export class TracklistEntity {
  @Prop({ type: Types.ObjectId, index: true, required: true })
  guild: Types.ObjectId | GuildDocument;
}

export type TracklistDocument = TracklistEntity &
  Document &
  SchemaTimestampsConfig;

export const TracklistModel = {
  name: TracklistEntity.name,
  schema: SchemaFactory.createForClass(TracklistEntity),
  collection: 'tracklist',
};
