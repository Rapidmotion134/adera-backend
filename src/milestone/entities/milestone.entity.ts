import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

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
  status: 'pending' | 'in_progress' | 'completed';

  @Column('text')
  admin: string;

  @OneToMany(() => Task, (task) => task.milestone, {
    cascade: true,
    nullable: true,
  })
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.milestones)
  user: User;
}
