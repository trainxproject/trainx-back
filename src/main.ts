import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '', // Permitir todas las solicitudes CORS
  })

  const config = new DocumentBuilder()
    .setTitle('TRAIN-X')
    .setDescription('Documentación de API para TRAIN-X')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('TrainX-Api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
