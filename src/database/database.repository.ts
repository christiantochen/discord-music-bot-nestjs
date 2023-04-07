import { OnApplicationBootstrap } from '@nestjs/common';
import { GuildDocument, GuildEntity } from './schemas/guild.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  TracklistDocument,
  TracklistEntity,
  TrackDocument,
  TrackEntity,
  UserDocument,
  UserEntity,
} from './schemas';

export class DatabaseRepository implements OnApplicationBootstrap {
  guilds: Model<GuildDocument>;
  tracklist: Model<TracklistDocument>;
  tracks: Model<TrackDocument>;
  users: Model<UserDocument>;

  constructor(
    @InjectModel(GuildEntity.name)
    private readonly guildModel: Model<GuildDocument>,
    @InjectModel(TracklistEntity.name)
    private readonly tracklistModel: Model<TracklistDocument>,
    @InjectModel(TrackEntity.name)
    private readonly trackModel: Model<TrackDocument>,
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  onApplicationBootstrap() {
    this.guilds = this.guildModel;
    this.tracklist = this.tracklistModel;
    this.tracks = this.trackModel;
    this.users = this.userModel;
  }
}
