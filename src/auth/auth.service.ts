import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from './auth.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly users: AuthEntity[] = [];
  private authCounter = 1;
  private userCounter = 1;

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    if (this.users.find((u) => u.email === dto.email)) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const id = `auth_${String(this.authCounter++).padStart(3, '0')}`;
    const userId = `usr_${String(this.userCounter++).padStart(3, '0')}`;

    const user: AuthEntity = {
      id,
      userId,
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      role: dto.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.users.push(user);

    return {
      user: { id: userId, fullName: dto.fullName, email: dto.email, role: dto.role },
      token: this.signToken(user),
    };
  }

  async login(dto: LoginDto) {
    const user = this.users.find((u) => u.email === dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return {
      token: this.signToken(user),
      user: { id: user.userId, fullName: user.fullName, email: user.email, role: user.role },
    };
  }

  getMe(userId: string) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return { id: user.userId, fullName: user.fullName, email: user.email, role: user.role };
  }

  validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { userId: payload.sub, role: payload.role };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  private signToken(user: AuthEntity): string {
    return this.jwtService.sign({ sub: user.userId, email: user.email, role: user.role });
  }
}
