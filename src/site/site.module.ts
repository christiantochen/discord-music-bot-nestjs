import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
