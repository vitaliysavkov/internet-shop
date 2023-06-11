import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';

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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(+configService.get('APP_PORT') || 3000);
}
bootstrap();
