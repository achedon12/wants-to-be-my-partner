import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from './config/datasource';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pkg from '../package.json';

async function bootstrap() {
  await AppDataSource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization:', err);
      });

  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
  );

  const config = new DocumentBuilder()
      .setTitle('Qui veut être mon associé API')
      .setDescription('API for managing Qui veut être mon associé data')
      .setVersion(pkg.version)
      .addBearerAuth()
      .build();

  const documentent = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentent);

  await app.listen(3000);
}
bootstrap();
