import { Controller, Get, Param } from '@nestjs/common';
import { YouTubeVideo } from 'play-dl';
import { SiteService } from './site.service';
import { YoutubeService } from '../shared/music/services';
import { IsPublic } from 'src/common/decorators';
import { ApiParam } from '@nestjs/swagger';

@Controller()
export class SiteController {
  constructor(
    private readonly appService: SiteService,
    private readonly youtubeService: YoutubeService,
  ) {}

  @Get()
  @IsPublic()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/youtube')
  findAll(): Promise<YouTubeVideo[]> {
    return this.youtubeService.findAll('Amazarashi');
  }

  @Get('/youtube/:id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  findOne(@Param('id') id: string): Promise<YouTubeVideo> {
    return this.youtubeService.findOne(id);
  }
}
