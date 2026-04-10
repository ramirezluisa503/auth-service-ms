import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthUser } from './auth/entities/auth-user.entity';

@Module({
  imports: [
    // 1. Esto permite que NestJS lea tu archivo .env
    ConfigModule.forRoot(),

    // 2. Configuración de la conexión a MySQL usando TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [AuthUser], // Le presentamos nuestra clase para que la convierta en tabla
      synchronize: true, // LA MAGIA: NestJS creará la tabla automáticamente
    }),

    // 3. Tu módulo original
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
