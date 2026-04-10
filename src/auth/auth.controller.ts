import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);

    return {
      message: 'Usuario registrado correctamente',
      data: {
        user: result.user,
        token: result.token,
      },
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);

    return {
      message: 'Usuario autenticado correctamente',
      data: {
        user: result.user,
        token: result.token,
      },
    };
  }

  @Post('validate')
  @HttpCode(200)
  validate(@Body() body: { token: string }) {
    if (!body.token) {
      throw new BadRequestException('El token es requerido');
    }

    const payload = this.authService.validateToken(body.token);

    return {
      message: 'Token válido',
      data: {
        userId: payload.userId,
        role: payload.role,
      },
    };
  }

  @Get('me')
  async me(@Headers('authorization') authorization: string) {
    const user = await this.authService.getAuthenticatedUser(authorization);

    return {
      message: 'Usuario autenticado',
      data: {
        user,
      },
    };
  }
}
