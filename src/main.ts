import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitar CORS
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Hostaland')
    .setDescription('Documentación de la API con Swagger')
    .setVersion('1.0')
    .addBearerAuth() // 🔹 Solo afecta a los endpoints que usen `@ApiBearerAuth()`
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
