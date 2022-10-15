import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot';
import { configuration } from './config';
import { SharedModule } from './shared';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    SharedModule, // Global
    AppModule,
    BotModule,
    SiteModule,
  ],
})
export class AppModule {}
