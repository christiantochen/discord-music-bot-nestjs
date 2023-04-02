import { Module } from '@nestjs/common';
import { BotModule } from './bot';
import { SiteModule } from './site/site.module';
import { CoreModule } from './core.module';
import { DatabaseModule } from './database';

@Module({
  imports: [CoreModule, DatabaseModule, BotModule, SiteModule],
})
export class AppModule {}
