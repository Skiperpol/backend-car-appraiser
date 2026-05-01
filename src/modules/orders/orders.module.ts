import { Module } from '@nestjs/common';
import { ORDERS_REPOSITORY } from './application/ports/orders-repository.port';
import {
  CreateOrderUseCase,
  DeleteOrderUseCase,
  GetAllOrdersUseCase,
  GetOrderByIdUseCase,
  UpdateOrderUseCase,
} from './application/use-cases/orders.use-cases';
import { OrdersTypeOrmRepository } from './infrastructure/typeorm/orders-typeorm.repository';
import { OrdersController } from './presentation/controllers/orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    GetAllOrdersUseCase,
    GetOrderByIdUseCase,
    UpdateOrderUseCase,
    DeleteOrderUseCase,
    {
      provide: ORDERS_REPOSITORY,
      useClass: OrdersTypeOrmRepository,
    },
  ],
})
export class OrdersModule {}
