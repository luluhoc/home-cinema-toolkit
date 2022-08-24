import { Test, TestingModule } from '@nestjs/testing';
import { AgeService } from './age.service';

describe('AgeService', () => {
  let service: AgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgeService],
    }).compile();

    service = module.get<AgeService>(AgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
