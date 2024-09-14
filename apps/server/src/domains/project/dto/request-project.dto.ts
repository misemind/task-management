import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDate, IsArray, IsIn, IsDateString } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class RequestProjectDto {

    @ApiProperty({ description: 'Title of the project' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Description of the project' })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ description: 'Priority level of the project' })
    @IsString()
    @IsIn(['low', 'medium', 'high']) // Assuming these are the valid values for priority
    priority: string;

    @ApiProperty({ description: 'Current status of the project' })
    @IsString()
    @IsIn(['pending', 'inprogress', 'completed']) // Assuming these are the valid values for status
    status: string;

    @ApiProperty({ description: 'Deadline for the project', type: String })
    @IsDateString()
    endDate: Date;

    @ApiProperty({ description: 'Start Date for the project', type: String })
    @IsDateString()
    @IsOptional()
    startDate: Date;

    @ApiProperty({ description: 'Privacy setting of the project' })
    @IsString()
    @IsOptional()
    @IsIn(['public', 'private']) // Assuming these are the valid values for privacy
    privacy: string;

    @ApiProperty({ description: 'Category of the project' })
    @IsString()
    @IsOptional()
    category: string;

    @ApiProperty({ description: 'Thumbnail image for the project' })
    @IsString()
    @IsOptional()
    thumbnailImage: string;

    @ApiProperty({ description: 'Tags associated with the project', isArray: true })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty({ description: 'Team Lead for the project' })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    teamLead: string;

    @ApiProperty({ description: 'Skills for the project' })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    skills: string[];

    @ApiProperty({ description: 'Employees associated with the project', isArray: true })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    employees: string[];

    @ApiProperty({ description: 'Last updated timestamp for the project', type: String })
    @IsDateString()
    @IsOptional()
    updated: Date;

    @ApiProperty({ description: 'Files associated with the project', isArray: true })
    @IsArray()
    @IsOptional()
    files: {
        fileName: string;
        filePath: string;
        fileSize: number;
        fileExtension: string;
    }[];


    toCreateProjectDTO() {
        const createProjectDto = new CreateProjectDto();
        createProjectDto.category = this.category;
        createProjectDto.description = this.description;
        createProjectDto.endDate = this.endDate;
        createProjectDto.priority = this.priority;
        createProjectDto.privacy = this.privacy;
        createProjectDto.skills = this.skills;
        createProjectDto.title = this.title;
        createProjectDto.startDate = this.startDate;
        createProjectDto.status = this.status;
        createProjectDto.updated = this.updated;
        createProjectDto.tags = this.tags;
        createProjectDto.thumbnailImage = this.thumbnailImage;
        createProjectDto.teamLead = this.teamLead;
        return createProjectDto;
    }

}


