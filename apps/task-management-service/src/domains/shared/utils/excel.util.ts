import * as xlsx from 'xlsx';
import { BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from '@app/domains/task/dto/create-task.dto';

export const parseCsvToJson = (buffer: Buffer): CreateTaskDto[] => {
  try {
    // Ensure the buffer is not empty
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('Buffer is empty or not valid');
    }

    // Parse the CSV buffer
    const workbook = xlsx.read(buffer, { type: 'buffer' });

    // Get the first sheet in the workbook
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Validate that the sheet contains data
    if (!sheet || !sheet['!ref'] || sheet['!ref'] === 'A1') {
      throw new BadRequestException('The CSV file does not contain valid data');
    }

    // Convert the sheet (CSV data) into JSON format
    const jsonData: CreateTaskDto[] = xlsx.utils.sheet_to_json(sheet, { header: ["title", "description", "priority", "status", "deadline"] });
    console.log('Parsed JSON data:', jsonData);

    // Validate that the parsed JSON contains data
    if (!jsonData || jsonData.length === 0) {
      throw new BadRequestException('The CSV file does not contain any valid data');
    }

    return jsonData;
  } catch (error) {
    console.error('Error while parsing CSV file:', error.message); // Log the error for better debugging
    throw new BadRequestException(`Failed to parse CSV file: ${error.message}`);
  }
};

