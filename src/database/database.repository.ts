import { OnApplicationBootstrap } from '@nestjs/common';

export class DatabaseRepository implements OnApplicationBootstrap {
  constructor() {}
  onApplicationBootstrap() {}
}
