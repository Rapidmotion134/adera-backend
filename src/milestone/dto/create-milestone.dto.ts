import { Task } from '../entities/task.entity';
import { User } from '../../user/entities/user.entity';

export class CreateMilestoneDto {
  title: string;
  startDate: Date;
  dueDate: Date;
  tasks: Task[];
  user: User;
  admin: string;
}
