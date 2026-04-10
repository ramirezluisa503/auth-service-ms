import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUser } from './entities/auth-user.entity';

@Module({
  imports: [
    // Conectamos la tabla a este módulo
    TypeOrmModule.forFeature([AuthUser]),

    JwtModule.register({
      global: true,
      secret: 'your-secret-key', // En el futuro cambiaremos esto a una variable de entorno
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
