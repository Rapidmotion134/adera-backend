import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Project } from '../../project/entities/project.entity';

@Entity('milestone')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('date')
  startDate: Date;

  @Column('date')
  dueDate: Date;

  @Column('text', { default: 'pending' })
  status: 'pending' | 'in-progress' | 'completed';

  @OneToMany(() => Task, (task) => task.milestone, {
    cascade: true,
    nullable: true,
  })
  tasks: Task[];

  @ManyToOne(() => Project, (project) => project.milestones)
  project: Project;
}
