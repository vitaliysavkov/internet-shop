import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export const NestJWT = JwtModule.registerAsync({
  useFactory: (config: ConfigService) => ({
    signOptions: {
      expiresIn: +config.get('JWT_ACCESS_EXPIRES_IN'),
    },
  }),
  inject: [ConfigService],
});
