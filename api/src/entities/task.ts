import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
  active = 'active',
  completed = 'completed'
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: 'varchar', length: 500 })
  title: string = '';

  @Column({ type: 'varchar', length: 16 })
  status: TaskStatus = TaskStatus.active;
}
