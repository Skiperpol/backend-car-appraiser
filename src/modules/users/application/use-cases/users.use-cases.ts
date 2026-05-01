import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY } from '../ports/users-repository.port';
import type { UsersRepositoryPort } from '../ports/users-repository.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repository: UsersRepositoryPort,
  ) {}

  execute(payload: Record<string, unknown>) {
    return this.repository.create(payload);
  }
}

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repository: UsersRepositoryPort,
  ) {}

  execute() {
    return this.repository.findAll();
  }
}

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repository: UsersRepositoryPort,
  ) {}

  async execute(id: number) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return record;
  }
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repository: UsersRepositoryPort,
  ) {}

  async execute(id: number, payload: Record<string, unknown>) {
    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updated;
  }
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repository: UsersRepositoryPort,
  ) {}

  async execute(id: number) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
