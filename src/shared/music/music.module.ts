import { Module } from '@nestjs/common';
import { YoutubeService } from './services';

@Module({
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class MusicModule {}
