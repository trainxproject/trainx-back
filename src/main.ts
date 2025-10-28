import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import ngrok from "ngrok"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())


  ngrok.authtoken(process.env.NGROK_AUTHTOKEN as string)
  .then(()=> ngrok.connect(3000))
  .then(url => console.log('🔄 Webhook URL para Mercado Pago:', url + '/webhooks/mercadopago'))
  .catch(err => console.error('❌ Error ngrok'))
  
  const config = new DocumentBuilder()
    .setTitle('TRAIN-X')
    .setDescription('Complete REST API for TRAIN-X Gym Management System. Handle memberships, class reservations, training plans, coach scheduling, and member activities. Provides full gym management capabilities including user authentication, booking system, and membership plans.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('TrainX-Api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
