import {
  // BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('int')
  stripeAmount: number;

  @Column('int')
  amount: number;

  @Column('text')
  bankName: string;

  @Column('text')
  bankAccount: string;

  @Column('text')
  accountName: string;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('text', { nullable: true })
  url: string;

  @Column('boolean', { default: 'false' })
  isPaid: boolean;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
