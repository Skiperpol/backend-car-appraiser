import { Module } from '@nestjs/common';
import { USERS_REPOSITORY } from './application/ports/users-repository.port';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from './application/use-cases/users.use-cases';
import { UsersTypeOrmRepository } from './infrastructure/typeorm/users-typeorm.repository';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersTypeOrmRepository,
    },
  ],
})
export class UsersModule {}
