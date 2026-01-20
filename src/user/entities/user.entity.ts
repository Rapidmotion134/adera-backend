import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Document } from '../../document/entities/document.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Milestone } from '../../milestone/entities/milestone.entity';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  firstName: string;

  @Column('text', { nullable: true })
  lastName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('text')
  password: string;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @Column('text', { default: 'main', nullable: true })
  adminType: 'main' | 'staff' | 'supervisor';

  @Column('boolean', { default: false })
  isSuperAdmin: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  registrationDate: Date;

  @OneToMany(() => Document, (document) => document.user, { cascade: true })
  documents: Document[];

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payments: Payment[];

  @OneToMany(() => Milestone, (milestone) => milestone.user, { cascade: true })
  milestones: Milestone[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notifications: Notification[];

  @BeforeInsert()
  async beforeUserInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
