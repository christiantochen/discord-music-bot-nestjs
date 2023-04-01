import { Module } from '@nestjs/common';
import { BotModule } from './bot';
import { SiteModule } from './site/site.module';
import { CoreModule } from './core.module';

@Module({
  imports: [CoreModule, BotModule, SiteModule],
})
export class AppModule {}
