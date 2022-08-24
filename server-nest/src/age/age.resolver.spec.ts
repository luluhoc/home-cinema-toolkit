import { Test, TestingModule } from '@nestjs/testing';
import { AgeResolver } from './age.resolver';

describe('AgeResolver', () => {
  let resolver: AgeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgeResolver],
    }).compile();

    resolver = module.get<AgeResolver>(AgeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
