import {
  BeforeInsert,
  Column,
  Entity,
  // JoinColumn,
  // ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { User } from '../../user/entities/user.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  type: string;

  @Column('text', { unique: true })
  productId: string;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('text')
  url: string;

  @Column('boolean', { default: 'false' })
  isPaid: boolean;

  // @ManyToOne(() => User, (user) => user.payment, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user: User;

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
