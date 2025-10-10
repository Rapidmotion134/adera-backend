import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('page')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  image: string;

  @Column('text')
  url: string;

  @Column('text', { nullable: true })
  category: 'Service Request' | 'Appointment Request' | 'Support Request';
}
