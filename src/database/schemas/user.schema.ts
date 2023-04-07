import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTimestampsConfig } from 'mongoose';

@Schema({ timestamps: true })
export class UserEntity {}

export type UserDocument = UserEntity & Document & SchemaTimestampsConfig;

export const UserModel = {
  name: UserEntity.name,
  schema: SchemaFactory.createForClass(UserEntity),
  collection: 'users',
};
