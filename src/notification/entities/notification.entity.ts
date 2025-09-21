import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: 'Payment Received' | 'New User' | 'New Document Received';

  @Column('text')
  description: string;

  @Column('boolean', { default: false })
  isRead: boolean;

  @Column('int', { nullable: true })
  item: number;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
