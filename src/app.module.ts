import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { NotesModule } from './modules/notes/notes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule, OrdersModule, NotesModule, ReportsModule],
})
export class AppModule {}
