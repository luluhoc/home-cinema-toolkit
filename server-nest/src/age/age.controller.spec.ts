import { Test, TestingModule } from '@nestjs/testing';
import { AgeController } from './age.controller';

describe('AgeController', () => {
  let controller: AgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgeController],
    }).compile();

    controller = module.get<AgeController>(AgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
