import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USERS_REPOSITORY } from '../../../users/application/ports/users-repository.port';
import type { UsersRepositoryPort } from '../../../users/application/ports/users-repository.port';
import {
  PASSWORD_HASHER,
  type PasswordHasherPort,
} from '../ports/password-hasher.port';
import { TOKEN_SIGNER, type TokenSignerPort } from '../ports/token-signer.port';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  tokenType: 'Bearer';
};

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly users: UsersRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SIGNER) private readonly tokenSigner: TokenSignerPort,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.users.findByEmailForAuth(input.email);
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.tokenSigner.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, tokenType: 'Bearer' };
  }
}
