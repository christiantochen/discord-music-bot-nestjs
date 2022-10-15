import { Test, TestingModule } from '@nestjs/testing';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

describe('SiteController', () => {
  let appController: SiteController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SiteController],
      providers: [SiteService],
    }).compile();

    appController = app.get<SiteController>(SiteController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
