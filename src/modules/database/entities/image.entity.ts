import { Entity, Column, AfterInsert } from 'typeorm';
import { CustomEntity } from './base.entity';
import { CreateImageType } from '@shared/interface';
import { ApiProperty } from '@nestjs/swagger';

@Entity('images')
export class ImageEntity extends CustomEntity implements CreateImageType {
  @ApiProperty({ example: 'wuwa/users/1' })
  @Column({ unique: true, nullable: true })
  filePath?: string;

  @ApiProperty({ example: 'http://localhost:3001/api/image/1' })
  @Column({ unique: true })
  url!: string;

  @AfterInsert()
  addIdToUrl() {
    this.url = `${this.url.replace(':id', String(this.id))}`;
  }
}
