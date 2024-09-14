import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './create-skill.dto';

export class updateSkillDto extends PartialType(CreateSkillDto) {}
