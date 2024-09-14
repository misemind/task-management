import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSkillDto } from '@app/domains/skill/dto/create-skill.dto';
import { SkillService } from '@app/domains/skill/services/skill.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@ApiTags('Skill')
@Controller('api/skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Skill' })
  @ApiResponse({ status: 201, description: 'The Skill has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }


  @Get()
  @ApiOperation({ summary: 'Get all Skills' })
  @ApiResponse({ status: 200, description: 'Return all skills.' })
  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.skillService.getSkills(limit, page);
  }
}
