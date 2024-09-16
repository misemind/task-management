import { ICommand } from "@nestjs/cqrs";
import { UpdateTaskDto } from "../../dto/update-task.dto";

export class BulkUpdateTaskCommand implements ICommand{
  constructor(public readonly tasks: UpdateTaskDto[]) {}
}