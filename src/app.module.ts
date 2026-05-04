import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { NotesModule } from './modules/notes/notes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    NotesModule,
    ReportsModule,
  ],
})
export class AppModule {}
