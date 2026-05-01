export interface OrdersRepositoryPort {
  create(payload: Record<string, unknown>): Promise<unknown>;
  findAll(): Promise<unknown[]>;
  findById(id: number): Promise<unknown | null>;
  update(id: number, payload: Record<string, unknown>): Promise<unknown | null>;
  delete(id: number): Promise<boolean>;
}

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');
