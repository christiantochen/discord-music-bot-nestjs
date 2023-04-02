import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseFactory implements MongooseOptionsFactory {
  database: {
    uri: string;
    ssl: boolean;
    debug: boolean;
  };

  constructor(private readonly configService: ConfigService) {
    this.database = this.configService.get('database');
  }

  createMongooseOptions(): MongooseModuleOptions {
    const options: MongooseModuleOptions = {
      uri: this.database.uri,
      ssl: this.database.ssl,
    };

    mongoose.set('debug', this.database.debug);

    return options;
  }
}
