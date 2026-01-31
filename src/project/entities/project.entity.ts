import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Milestone } from '../../milestone/entities/milestone.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('date')
  startDate: Date;

  @Column('date')
  dueDate: Date;

  @OneToMany(() => Milestone, (milestone) => milestone.project, {
    cascade: true,
    nullable: true,
  })
  milestones: Milestone[];

  @Column('date', { nullable: true })
  lastUpdated: Date;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @ManyToOne(() => User, (user) => user.projects)
  admin: User;
}
