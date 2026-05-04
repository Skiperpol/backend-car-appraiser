import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { SignOptions } from 'jsonwebtoken';
import { UsersModule } from '../users/users.module';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { TOKEN_SIGNER } from './application/ports/token-signer.port';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { BcryptPasswordHasherAdapter } from './infrastructure/bcrypt-password-hasher.adapter';
import { JwtAccessStrategy } from './infrastructure/jwt-access.strategy';
import { JwtTokenSignerAdapter } from './infrastructure/jwt-token-signer.adapter';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: false,
      secret: process.env.JWT_SECRET ?? 'dev-only-change-JWT_SECRET',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ??
          '7d') as SignOptions['expiresIn'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtAccessStrategy,
    LoginUseCase,
    RegisterUseCase,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasherAdapter,
    },
    {
      provide: TOKEN_SIGNER,
      useClass: JwtTokenSignerAdapter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
