import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum NoteType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  OPINION = 'OPINION',
  EXPERT_OPINION = 'EXPERT_OPINION',
}

@Entity({ name: 'Attachment' })
export class AttachmentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  noteId!: number;

  @Column({ length: 255 })
  fileUrl!: string;

  @Column({ length: 255 })
  fileName!: string;

  @Column({ type: 'timestamp' })
  createdAt!: Date;
}

@Entity({ name: 'Note' })
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  content!: string;

  @Column({ type: 'enum', enum: NoteType })
  type!: NoteType;

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column()
  authorId!: number;

  @Column()
  orderId!: number;
}

export const notesEntities = [AttachmentEntity, NoteEntity];
