import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateOrderUseCase,
  DeleteOrderUseCase,
  GetAllOrdersUseCase,
  GetOrderByIdUseCase,
  UpdateOrderUseCase,
} from '../../application/use-cases/orders.use-cases';

@Controller('api/orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
  ) {}

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.createOrderUseCase.execute(body);
  }

  @Get()
  findAll() {
    return this.getAllOrdersUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getOrderByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    return this.updateOrderUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteOrderUseCase.execute(id);
  }
}
