import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;
  //*****Swagger config *****/
  const swagger = new DocumentBuilder()
    .setTitle('Prseconecta-api')
    .setDescription('Prseconecta-api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  // Definimos la documentacion en la ruta /api
  SwaggerModule.setup('api', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  //*****ValidationPipe config *****/
  app.useGlobalPipes(new ValidationPipe());

  //! start app //
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
