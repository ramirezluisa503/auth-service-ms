import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return { success: true, message: 'Usuario registrado correctamente', data };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return { success: true, message: 'Login exitoso', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: any) {
    const data = this.authService.getMe(req.user.userId);
    return { success: true, message: 'Usuario autenticado', data };
  }

  @Post('validate')
  @HttpCode(200)
  validate(@Body() dto: ValidateTokenDto) {
    const data = this.authService.validateToken(dto.token);
    return { success: true, message: 'Token válido', data };
  }
}
