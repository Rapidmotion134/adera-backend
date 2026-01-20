import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Task } from '../../milestone/entities/task.entity';

@Entity('document')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  type: string;

  @Column('text', { nullable: true })
  category: 'Agreement' | 'Milestone';

  @Column('text', { unique: true })
  productId: string;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('boolean', { default: false })
  isRequested: boolean;

  @Column('text')
  url: string;

  @Column('boolean', { default: false })
  isRead: boolean;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Task, (task) => task.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @BeforeInsert()
  async generateUniqueCode() {
    this.productId = this.generateHexValue();
  }

  generateHexValue() {
    const timestamp = Date.now().toString(16).substring(0, 4);
    const randomPart = Math.random().toString(16).substring(2, 8);
    return `${timestamp}${randomPart}`;
  }
}
