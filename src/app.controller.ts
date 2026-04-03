import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
//hola soy un comentario mas comentario
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: 'Servicio de autenticación disponible',
      data: {
        greeting: this.appService.getHello(),
      },
    };
  }
}
