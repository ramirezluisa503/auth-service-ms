import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the expected success response object', () => {
      expect(appController.getHello()).toEqual({
        message: 'Servicio de autenticación disponible',
        data: {
          greeting: 'Hello World!',
        },
      });
    });
  });

  describe('register', () => {
    it('should return a created payload', () => {
      expect(appController.register()).toEqual({
        message: 'Usuario creado',
        data: {
          userId: '123',
        },
      });
    });
  });
});
