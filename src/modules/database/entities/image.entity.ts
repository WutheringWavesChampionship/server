import { Entity, Column, BeforeInsert } from 'typeorm';
import { CustomEntity } from './base.entity';
import { CreateImageType } from '@shared/interface';

@Entity('images')
export class ImageEntity extends CustomEntity implements CreateImageType {
  @Column({ unique: true, nullable: true })
  filePath?: string;

  @Column({ unique: true })
  url!: string;

  @BeforeInsert()
  addIdToUrl() {
    this.url = `${this.url.replace(':id', String(this.id))}`;
  }
}
