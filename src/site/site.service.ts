import { Injectable } from '@nestjs/common';

@Injectable()
export class SiteService {
  getHello(): string {
    return 'Hello World!';
  }
}
