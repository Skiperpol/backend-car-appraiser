export interface NotesRepositoryPort {
  create(payload: Record<string, unknown>): Promise<unknown>;
  findAll(): Promise<unknown[]>;
  findById(id: number): Promise<unknown | null>;
  update(id: number, payload: Record<string, unknown>): Promise<unknown | null>;
  delete(id: number): Promise<boolean>;
}

export const NOTES_REPOSITORY = Symbol('NOTES_REPOSITORY');
