import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users') // la tabla se llamará 'users'
export class AuthUser {
  @PrimaryGeneratedColumn('uuid') // Genera un ID único automáticamente
  id: string;

  @Column()
  userId: string;

  @Column()
  fullName: string;

  @Column({ unique: true }) // No permite correos repetidos
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'patient' }) // Rol por defecto
  role: string;

  @Column({ default: true }) // El usuario nace activo
  isActive: boolean;

  @CreateDateColumn() // MySQL guarda la fecha automáticamente
  createdAt: Date;
}
