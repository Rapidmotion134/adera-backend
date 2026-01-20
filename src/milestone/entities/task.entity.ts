import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Milestone } from './milestone.entity';
import { Document } from '../../document/entities/document.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('date')
  beginDate: Date;

  @Column('date')
  dueDate: Date;

  @Column('text')
  status: 'pending' | 'in_progress' | 'completed';

  @ManyToOne(() => Milestone, (milestone) => milestone.tasks)
  milestone: Milestone;

  @OneToMany(() => Document, (document) => document.task, { cascade: true })
  documents: Document[];
}
