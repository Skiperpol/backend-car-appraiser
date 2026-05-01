import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NOTES_REPOSITORY } from '../ports/notes-repository.port';
import type { NotesRepositoryPort } from '../ports/notes-repository.port';

@Injectable()
export class CreateNoteUseCase {
  constructor(
    @Inject(NOTES_REPOSITORY) private readonly repository: NotesRepositoryPort,
  ) {}

  execute(payload: Record<string, unknown>) {
    return this.repository.create(payload);
  }
}

@Injectable()
export class GetAllNotesUseCase {
  constructor(
    @Inject(NOTES_REPOSITORY) private readonly repository: NotesRepositoryPort,
  ) {}

  execute() {
    return this.repository.findAll();
  }
}

@Injectable()
export class GetNoteByIdUseCase {
  constructor(
    @Inject(NOTES_REPOSITORY) private readonly repository: NotesRepositoryPort,
  ) {}

  async execute(id: number) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return record;
  }
}

@Injectable()
export class UpdateNoteUseCase {
  constructor(
    @Inject(NOTES_REPOSITORY) private readonly repository: NotesRepositoryPort,
  ) {}

  async execute(id: number, payload: Record<string, unknown>) {
    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return updated;
  }
}

@Injectable()
export class DeleteNoteUseCase {
  constructor(
    @Inject(NOTES_REPOSITORY) private readonly repository: NotesRepositoryPort,
  ) {}

  async execute(id: number) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }
}
