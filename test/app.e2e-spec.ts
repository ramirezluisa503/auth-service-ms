import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        success: true,
        message: 'Servicio de autenticación disponible',
        data: {
          greeting: 'Hello World!',
        },
      });
  });

  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Ana Gómez',
        email: 'ana@example.com',
        password: '123456',
        role: 'patient',
      })
      .expect(201);

    expect(response.body).toEqual({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        user: {
          id: 'usr_001',
          fullName: 'Ana Gómez',
          email: 'ana@example.com',
          role: 'patient',
        },
        token: expect.any(String),
      },
    });
  });

  it('/auth/login (POST) and /auth/me (GET)', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Ana Gómez',
        email: 'ana@example.com',
        password: '123456',
        role: 'patient',
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ana@example.com',
        password: '123456',
      })
      .expect(200);

    expect(loginResponse.body).toEqual({
      success: true,
      message: 'Usuario autenticado correctamente',
      data: {
        user: {
          id: 'usr_001',
          fullName: 'Ana Gómez',
          email: 'ana@example.com',
          role: 'patient',
        },
        token: expect.any(String),
      },
    });

    const token = loginResponse.body.data.token;

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({
        success: true,
        message: 'Usuario autenticado',
        data: {
          user: {
            id: 'usr_001',
            fullName: 'Ana Gómez',
            email: 'ana@example.com',
            role: 'patient',
          },
        },
      });
  });
});
