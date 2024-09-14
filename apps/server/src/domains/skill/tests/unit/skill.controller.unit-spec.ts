import { Test, TestingModule } from '@nestjs/testing';
import { SkillController } from '../../controllers/skill.controller';
import { SkillService } from '../../services/skill.service';
import { CreateSkillDto } from '../../dto/create-skill.dto';

const mockSkill = {
  _id: '507f1f77bcf86cd799439011',
  name: 'JavaScript',
  category: 'Programming Language',
};

const mockSkillService = {
  create: jest.fn(),
  getSkills: jest.fn(),
};

describe('SkillController', () => {
  let controller: SkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillController],
      providers: [
        {
          provide: SkillService,
          useValue: mockSkillService,
        },
      ],
    }).compile();

    controller = module.get<SkillController>(SkillController);
  });

  it('should create a skill', async () => {
    const createSkillDto: CreateSkillDto = {
      name: 'JavaScript',
      category: 'Programming Language',
    };

    mockSkillService.create.mockResolvedValue(mockSkill);

    const result = await controller.create(createSkillDto);

    expect(result).toEqual(mockSkill);
    expect(mockSkillService.create).toHaveBeenCalledWith(createSkillDto);
  });

  it('should return all skills', async () => {
    const paginationDto = { limit: 10, page: 1 };
    const skills = [mockSkill];

    mockSkillService.getSkills.mockResolvedValue(skills);

    const result = await controller.findAll(paginationDto);
    expect(result).toEqual(skills);
    expect(mockSkillService.getSkills).toHaveBeenCalledWith(10, 1);
  });
});