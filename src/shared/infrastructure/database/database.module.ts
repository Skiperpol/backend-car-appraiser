import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { notesEntities } from '../../../modules/notes/infrastructure/typeorm/notes.entities';
import { ordersEntities } from '../../../modules/orders/infrastructure/typeorm/orders.entities';
import { reportsEntities } from '../../../modules/reports/infrastructure/typeorm/reports.entities';
import { usersEntities } from '../../../modules/users/infrastructure/typeorm/users.entities';

const allEntities = [...usersEntities, ...ordersEntities, ...notesEntities, ...reportsEntities];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'admin',
      database: process.env.DB_NAME ?? 'car_appraiser',
      entities: allEntities,
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature(allEntities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
