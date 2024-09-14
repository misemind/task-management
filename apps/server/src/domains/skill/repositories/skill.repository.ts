import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SkillDocument, Skill } from "@app/domains/skill/entities/skill.entity";
import { CreateSkillDto } from "@app/domains/skill/dto/create-skill.dto";


@Injectable()
export class SkillRepository {
  constructor(@InjectModel(Skill.name) private readonly skillModel: Model<SkillDocument>) { }

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const newSkill = new this.skillModel(createSkillDto);
    return newSkill.save();
  }

  async saveAll(createSkillDto: CreateSkillDto[]): Promise<Skill[]> {
    const newSkill = await this.skillModel.insertMany(createSkillDto);
    return newSkill.map(doc => doc.toObject() as Skill);
  }

  async findAll(limit: number, skip: number): Promise<Skill[]> {
    return this.skillModel.find().skip(skip).limit(limit).exec();
  }

}
