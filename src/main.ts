import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ ¡NUEVO! Activamos el guardia de seguridad para toda la app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Bloquea datos extraños que no estén en el DTO (seguridad extra)
      forbidNonWhitelisted: true, // Lanza error si mandan datos que no pedimos
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
  console.log(`Microservicio de Auth corriendo en puerto interno: 3000`);
}
bootstrap();
