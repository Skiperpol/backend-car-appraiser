import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { OrdersRepositoryPort } from '../../application/ports/orders-repository.port';
import { OrderEntity } from './orders.entities';

@Injectable()
export class OrdersTypeOrmRepository implements OrdersRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  async create(payload: Record<string, unknown>) {
    const repository = this.dataSource.getRepository(OrderEntity);
    const entity = repository.create(payload);
    return repository.save(entity);
  }

  findAll() {
    return this.dataSource.getRepository(OrderEntity).find();
  }

  findById(id: number) {
    return this.dataSource.getRepository(OrderEntity).findOneBy({ id });
  }

  async update(id: number, payload: Record<string, unknown>) {
    const repository = this.dataSource.getRepository(OrderEntity);
    const existing = await repository.findOneBy({ id });
    if (!existing) {
      return null;
    }

    return repository.save(repository.merge(existing, payload));
  }

  async delete(id: number) {
    const result = await this.dataSource.getRepository(OrderEntity).delete(id);
    return (result.affected ?? 0) > 0;
  }
}
