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

@Entity('document')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  type: string;

  @Column('text', { unique: true })
  productId: string;

  @Column('boolean', { default: false })
  isExpiring: boolean;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  issueDate: Date;

  @Column('date', {
    default: new Date(
      new Date().getFullYear() + 1,
      new Date().getMonth(),
      new Date().getDay(),
    ),
  })
  expiryDate: Date;

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
