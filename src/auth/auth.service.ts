import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { AuthUser } from './entities/auth-user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly users: AuthUser[] = [];
  private readonly tokenStore = new Map<string, string>();
  private nextSequence = 1;
  private readonly roles = ['admin', 'staff', 'patient'];

  register(registerDto: RegisterDto) {
    const { email, password, fullName, role } = registerDto;

    if (!email || !password || !fullName || !role) {
      throw new BadRequestException('Todos los campos son obligatorios');
    }

    if (!this.roles.includes(role)) {
      throw new BadRequestException('Role inválido');
    }

    if (this.users.some((user) => user.email === email)) {
      throw new ConflictException('El correo ya está registrado');
    }

    const sequence = this.nextSequence++;
    const user: AuthUser = {
      id: `auth_${String(sequence).padStart(3, '0')}`,
      userId: `usr_${String(sequence).padStart(3, '0')}`,
      fullName,
      email,
      passwordHash: this.hashPassword(password),
      role: role as AuthUser['role'],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.users.push(user);
    const token = this.createToken(user.userId);

    return {
      user: {
        id: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }

    const user = this.users.find((stored) => stored.email === email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.passwordHash !== this.hashPassword(password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.createToken(user.userId);
    return {
      user: {
        id: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  getAuthenticatedUser(authHeader: string | undefined) {
    const token = this.extractToken(authHeader);
    if (!token) {
      throw new UnauthorizedException('Token no válido');
    }

    const userId = this.tokenStore.get(token);
    if (!userId) {
      throw new UnauthorizedException('Token no válido');
    }

    const user = this.users.find(
      (stored) => stored.userId === userId && stored.isActive,
    );
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }

  private createToken(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    this.tokenStore.set(token, userId);
    return token;
  }

  private hashPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private extractToken(authHeader: string | undefined) {
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
