import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ORDERS_REPOSITORY } from '../ports/orders-repository.port';
import type { OrdersRepositoryPort } from '../ports/orders-repository.port';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY) private readonly repository: OrdersRepositoryPort,
  ) {}

  execute(payload: Record<string, unknown>) {
    return this.repository.create(payload);
  }
}

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY) private readonly repository: OrdersRepositoryPort,
  ) {}

  execute() {
    return this.repository.findAll();
  }
}

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY) private readonly repository: OrdersRepositoryPort,
  ) {}

  async execute(id: number) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return record;
  }
}

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY) private readonly repository: OrdersRepositoryPort,
  ) {}

  async execute(id: number, payload: Record<string, unknown>) {
    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return updated;
  }
}

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY) private readonly repository: OrdersRepositoryPort,
  ) {}

  async execute(id: number) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }
}
