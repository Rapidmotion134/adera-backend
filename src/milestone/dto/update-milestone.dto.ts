import { PartialType } from '@nestjs/mapped-types';
import { CreateMilestoneDto } from './create-milestone.dto';
import { Task } from '../entities/task.entity';
import { User } from '../../user/entities/user.entity';

export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {
  title: string;
  startDate: Date;
  dueDate: Date;
  tasks: Task[];
  user: User;
  admin: string;
  status: 'pending' | 'in-progress' | 'completed';
}
