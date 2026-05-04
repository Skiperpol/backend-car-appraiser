import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255, nullable: true })
  phone?: string;

  @Column({ length: 255, nullable: true })
  firstName?: string;

  @Column({ length: 255, nullable: true })
  lastName?: string;

  @Column({ length: 255, nullable: true })
  type?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordHash?: string | null;
}

export const usersEntities = [UserEntity];
