import { Milestone } from '../../milestone/entities/milestone.entity';
import { User } from '../../user/entities/user.entity';

export class CreateProjectDto {
  title: string;
  description: string;
  milestones: Milestone[];
  user: User;
  admin: User;
}
