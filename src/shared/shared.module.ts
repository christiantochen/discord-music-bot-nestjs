import { Global, Module } from '@nestjs/common';
import { MusicModule } from './music';

@Global()
@Module({
  imports: [MusicModule],
  exports: [MusicModule],
})
export class SharedModule {}
