import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransientFile, TransientFileDocument } from '@app/domains/transient-files/entities/transient-file.entity';

@Injectable()
export class TransientFileRepository {
    constructor(
        @InjectModel(TransientFile.name) private readonly transientFileModel: Model<TransientFileDocument>,
    ) { }

    async create(filePath: string, expiresAt: Date): Promise<TransientFile> {
        const transientFile = new this.transientFileModel({
            filePath,
            createdAt: new Date(),
            expiresAt,
        });
        return transientFile.save();
    }

    async findById(id: string): Promise<TransientFile | null> {
        return this.transientFileModel.findById(id).exec();
    }

    async findAll(limit: number, page: number): Promise<TransientFile[]> {
        const skip = (page - 1) * limit;
        return this.transientFileModel.find().skip(skip).limit(limit).exec();
    }

    async delete(id: string): Promise<TransientFile | null> {
        return this.transientFileModel.findByIdAndDelete(id).exec();
    }
    async findExpiredFiles(currentDate: Date): Promise<TransientFile[]> {
        return this.transientFileModel.find({ expiresAt: { $lte: currentDate } }).exec();
    }
}
