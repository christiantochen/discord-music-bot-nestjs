import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseFactory } from './database.factory';
import { DatabaseRepository } from './database.repository';

@Module({
  providers: [DatabaseRepository],
  exports: [DatabaseRepository],
  imports: [
    MongooseModule.forFeature(),
    MongooseModule.forRootAsync({
      useClass: DatabaseFactory,
    }),
  ],
})
export class DatabaseModule {}
