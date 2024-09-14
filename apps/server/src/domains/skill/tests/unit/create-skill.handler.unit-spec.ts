import { Test, TestingModule } from '@nestjs/testing';
import { CreateSkillHandler } from '../../commands/handlers/create-skill.handler';
import { SkillRepository } from '../../repositories/skill.repository';
import { CreateSkillCommand } from '../../commands/impl/create-skill.command';
import { CreateSkillDto } from '../../dto/create-skill.dto';

const mockSkill = {
  _id: '507f1f77bcf86cd799439011',
  name: 'JavaScript',
  category: 'Programming Language',
};

describe('CreateSkillHandler', () => {
  let handler: CreateSkillHandler;
  let repository: SkillRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSkillHandler,
        {
          provide: SkillRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockSkill),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateSkillHandler>(CreateSkillHandler);
    repository = module.get<SkillRepository>(SkillRepository);
  });

  it('should create a skill', async () => {
    const createSkillDto: CreateSkillDto = {
      name: 'JavaScript',
      category: 'Programming Language',
    };

    const command = new CreateSkillCommand(createSkillDto);
    const result = await handler.execute(command);

    expect(result).toEqual(mockSkill);
    expect(repository.create).toHaveBeenCalledWith(createSkillDto);
  });
});