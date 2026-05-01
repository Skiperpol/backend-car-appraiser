export interface UsersRepositoryPort {
  create(payload: Record<string, unknown>): Promise<unknown>;
  findAll(): Promise<unknown[]>;
  findById(id: number): Promise<unknown | null>;
  update(id: number, payload: Record<string, unknown>): Promise<unknown | null>;
  delete(id: number): Promise<boolean>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
