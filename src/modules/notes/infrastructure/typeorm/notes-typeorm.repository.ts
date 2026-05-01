import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { NotesRepositoryPort } from '../../application/ports/notes-repository.port';
import { NoteEntity } from './notes.entities';

@Injectable()
export class NotesTypeOrmRepository implements NotesRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  async create(payload: Record<string, unknown>) {
    const repository = this.dataSource.getRepository(NoteEntity);
    const entity = repository.create(payload);
    return repository.save(entity);
  }

  findAll() {
    return this.dataSource.getRepository(NoteEntity).find();
  }

  findById(id: number) {
    return this.dataSource.getRepository(NoteEntity).findOneBy({ id });
  }

  async update(id: number, payload: Record<string, unknown>) {
    const repository = this.dataSource.getRepository(NoteEntity);
    const existing = await repository.findOneBy({ id });
    if (!existing) {
      return null;
    }

    return repository.save(repository.merge(existing, payload));
  }

  async delete(id: number) {
    const result = await this.dataSource.getRepository(NoteEntity).delete(id);
    return (result.affected ?? 0) > 0;
  }
}
