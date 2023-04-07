import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTimestampsConfig } from 'mongoose';

@Schema({ timestamps: true })
export class TrackEntity {
  @Prop({ type: String, unique: true, index: true, required: true })
  id: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  durationRaw: string;

  @Prop({ type: Number, required: true })
  durationInSec: number;

  @Prop({ type: String, required: true })
  type: string;
}

export type TrackDocument = TrackEntity & Document & SchemaTimestampsConfig;

export const TrackModel = {
  name: TrackEntity.name,
  schema: SchemaFactory.createForClass(TrackEntity),
  collection: 'tracks',
};
