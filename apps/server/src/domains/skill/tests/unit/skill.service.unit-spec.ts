import { Test, TestingModule } from '@nestjs/testing';
import { SkillService } from '../../services/skill.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSkillDto } from '../../dto/create-skill.dto';
import { GetAllSkillsQuery } from '../../queries/impl/get-all-skills.query';
import { CreateSkillCommand } from '../../commands/impl/create-skill.command';

const mockSkill = {
  _id: '507f1f77bcf86cd799439011',
  name: 'JavaScript',
  category: 'Programming Language',
};

const mockCommandBus = {
  execute: jest.fn(),
};

const mockQueryBus = {
  execute: jest.fn(),
};

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillService,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    service = module.get<SkillService>(SkillService);
  });

  it('should create a skill', async () => {
    const createSkillDto: CreateSkillDto = {
      name: 'JavaScript',
      category: 'Programming Language',
    };

    mockCommandBus.execute.mockResolvedValue(mockSkill);

    const result = await service.create(createSkillDto);

    expect(result).toEqual(mockSkill);
    expect(mockCommandBus.execute).toHaveBeenCalledWith(new CreateSkillCommand(createSkillDto));
  });

  it('should return all skills', async () => {
    const paginationDto = { limit: 10, page: 1 };
    const skills = [mockSkill];

    mockQueryBus.execute.mockResolvedValue(skills);

    const result = await service.getSkills(10, 1);
    expect(result).toEqual(skills);
    expect(mockQueryBus.execute).toHaveBeenCalledWith(new GetAllSkillsQuery(10, 1));
  });
});