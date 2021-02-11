import { TaskStatus } from '../tasks.model';

export class getTasksFilterDto {
  status: TaskStatus;
  search: string;
}
