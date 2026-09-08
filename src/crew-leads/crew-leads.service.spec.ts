import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { CrewLeadsService } from './crew-leads.service.js';
import { MAX_CREW_LEADS } from '../domain/crew-lead.js';

describe('CrewLeadsService', () => {
  let service: CrewLeadsService;
  let mockManager: any;
  let mockQueryRunner: any;
  let mockDataSource: any;

  beforeEach(() => {
    mockManager = {
      count: vi.fn(),
      create: vi.fn((_entity, data) => data),
      save: vi.fn((data) => Promise.resolve({ id: 'generated-id', ...data })),
    };
    mockQueryRunner = {
      connect: vi.fn(),
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      rollbackTransaction: vi.fn(),
      release: vi.fn(),
      query: vi.fn(),
      manager: mockManager,
    };
    mockDataSource = { createQueryRunner: vi.fn(() => mockQueryRunner) };
    service = new CrewLeadsService({} as any, mockDataSource);
  });

  it('creates a Crew Lead when fewer than the maximum exist', async () => {
    mockManager.count.mockResolvedValue(2);
    const result = await service.create('Alice');
    expect(result).toMatchObject({ name: 'Alice' });
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
  });

  it('rejects creation once exactly the maximum already exist', async () => {
    mockManager.count.mockResolvedValue(MAX_CREW_LEADS);
    await expect(service.create('Dave')).rejects.toThrow(ConflictException);
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
  });

  it('acquires the advisory lock before checking the count, to serialize concurrent attempts', async () => {
    mockManager.count.mockResolvedValue(0);
    await service.create('Alice');
    expect(mockQueryRunner.query).toHaveBeenCalledWith('SELECT pg_advisory_xact_lock($1)', expect.any(Array));
  });
});