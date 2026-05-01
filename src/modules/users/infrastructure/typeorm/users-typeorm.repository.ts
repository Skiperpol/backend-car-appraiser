import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { UsersRepositoryPort } from '../../application/ports/users-repository.port';
import { UserEntity } from './users.entities';

@Injectable()
export class UsersTypeOrmRepository implements UsersRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  async create(payload: Record<string, unknown>) {
    const repository = this.dataSource.getRepository(UserEntity);
    const entity = repository.create(payload);
    return repository.save(entity);
  }

  findAll() {
    return this.dataSource.getRepository(UserEntity).find();
  }

  findById(id: number) {
    return this.dataSource.getRepository(UserEntity).findOneBy({ id });
  }

  async update(id: number, payload: Record<string, unknown>) {
    const repository = this.dataSource.getRepository(UserEntity);
    const existing = await repository.findOneBy({ id });
    if (!existing) {
      return null;
    }

    return repository.save(repository.merge(existing, payload));
  }

  async delete(id: number) {
    const result = await this.dataSource.getRepository(UserEntity).delete(id);
    return (result.affected ?? 0) > 0;
  }
}
