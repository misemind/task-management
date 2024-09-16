import * as xlsx from 'xlsx';
import { BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from '@app/domains/task/dto/create-task.dto';

export const parseExcelToJson = (buffer: Buffer): CreateTaskDto[] => {
  try {
    // Parse the buffer into a workbook
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    console.log(workbook,'@#@#@#');
    // Get the first sheet in the workbook
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet into JSON format
    const jsonData: CreateTaskDto[] = xlsx.utils.sheet_to_json(sheet);

    // Validate that the parsed JSON contains data
    if (!jsonData || jsonData.length === 0) {
      throw new BadRequestException('The Excel file does not contain any valid data');
    }

    return jsonData;
  } catch (error) {
    throw new BadRequestException(`Failed to parse Excel file: ${error.message}`);
  }
};
