import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    const result = this.authService.register(registerDto);
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
  login(@Body() loginDto: LoginDto) {
    const result = this.authService.login(loginDto);
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
    try {
      const payload = this.authService.validateToken(body.token);
      return {
        success: true,
        message: 'Token válido',
        data: {
          userId: payload.userId,
          role: payload.role,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Token inválido',
        data: null,
      };
    }
  }

  @Get('me')
  me(@Headers('authorization') authorization: string) {
    const user = this.authService.getAuthenticatedUser(authorization);
    return {
      message: 'Usuario autenticado',
      data: {
        user,
      },
    };
  }
}
