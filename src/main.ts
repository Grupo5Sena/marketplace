import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita la validación global para los DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si se envían propiedades no permitidas
    transform: true, // Convierte los tipos automáticamente (ej: string -> number)
  }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription('API para e-commerce con NestJS + Prisma')
    .setVersion('1.0')
    .addBearerAuth() // Habilita autenticación con JWT en Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Ruta: /docs

  // Inicia el servidor en el puerto especificado o 3000 por defecto
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
