import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CreatedModified {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
