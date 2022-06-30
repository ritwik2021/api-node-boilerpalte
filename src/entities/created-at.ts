import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class createdModified {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
