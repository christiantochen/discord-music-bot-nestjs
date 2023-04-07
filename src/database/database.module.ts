import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseFactory } from './database.factory';
import { DatabaseRepository } from './database.repository';
import { GuildModel, TracklistModel, TrackModel, UserModel } from './schemas';

@Module({
  providers: [DatabaseRepository],
  exports: [DatabaseRepository],
  imports: [
    MongooseModule.forFeature([
      GuildModel,
      TracklistModel,
      TrackModel,
      UserModel,
    ]),
    MongooseModule.forRootAsync({
      useClass: DatabaseFactory,
    }),
  ],
})
export class DatabaseModule {}
