import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { Milestone } from '../../milestone/entities/milestone.entity';
import { User } from '../../user/entities/user.entity';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  title: string;
  description: string;
  milestones: Milestone[];
  admin: User;
}
