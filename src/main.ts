import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const authGuard= await app.get(JwtAuthGuard);

  // To make endpoint public
  // Use @Public() decorator
  app.useGlobalGuards(authGuard);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get('APP_VERSION'),
  });

  if (configService.get('APP_ENV') !== 'production') {
    const config = new DocumentBuilder()
        .setTitle('ONLINE_SHOP REST API')
        .setDescription('Public endpoints')
        .setVersion(configService.get('APP_VERSION'))
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true
      }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  await app.listen(+configService.get('APP_PORT') || 3000);
}
bootstrap();
