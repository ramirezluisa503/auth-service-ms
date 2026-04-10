import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from './entities/auth-user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    // Inyectamos el repositorio para hablar con MySQL
    @InjectRepository(AuthUser)
    private userRepository: Repository<AuthUser>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, role } = registerDto;

    // 1. Buscamos en MySQL si el correo ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    // 2. Preparamos la entidad para guardarla
    const newUser = this.userRepository.create({
      userId: `usr_${Date.now()}`, // Generamos un ID interno rápido
      fullName,
      email,
      passwordHash: this.hashPassword(password),
      role: role || 'patient', // Por defecto será paciente
    });

    // 3. Guardamos físicamente en la tabla 'users'
    const savedUser = await this.userRepository.save(newUser);

    // 4. Creamos el token JWT
    const token = this.createToken(savedUser.userId, savedUser.role);

    return {
      user: {
        id: savedUser.userId,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt, // (ISO 8601)
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscamos al usuario en MySQL
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Comparamos contraseñas
    if (user.passwordHash !== this.hashPassword(password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generamos token y devolvemos datos
    const token = this.createToken(user.userId, user.role);
    return {
      user: {
        id: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt, // (ISO 8601)
      },
      token,
    };
  }

  validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  // Este método también busca en MySQL ahora
  async getAuthenticatedUser(authHeader: string | undefined) {
    const token = this.extractToken(authHeader);
    if (!token) {
      throw new UnauthorizedException('Token no válido');
    }

    const payload = this.validateToken(token);

    // Buscamos al usuario en la BD por su userId y validamos que esté activo
    const user = await this.userRepository.findOne({
      where: { userId: payload.userId, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt, // (ISO 8601)
    };
  }

  private createToken(userId: string, role: string) {
    const payload = { userId, role };
    return this.jwtService.sign(payload);
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
