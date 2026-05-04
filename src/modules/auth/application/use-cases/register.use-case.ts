import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '../../../users/application/ports/users-repository.port';
import type { UsersRepositoryPort } from '../../../users/application/ports/users-repository.port';
import {
  PASSWORD_HASHER,
  type PasswordHasherPort,
} from '../ports/password-hasher.port';
import { TOKEN_SIGNER, type TokenSignerPort } from '../ports/token-signer.port';

export type RegisterInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type RegisterResult = {
  accessToken: string;
  tokenType: 'Bearer';
};

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly users: UsersRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SIGNER) private readonly tokenSigner: TokenSignerPort,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const exists = await this.users.emailExists(input.email);
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    await this.users.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    const created = await this.users.findByEmailForAuth(input.email);
    if (!created) {
      throw new ConflictException('Registration failed');
    }

    const accessToken = this.tokenSigner.signAccessToken({
      sub: created.id,
      email: created.email,
    });

    return { accessToken, tokenType: 'Bearer' };
  }
}
