import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { createTypeOrmOptions } from './database.service';

export const DatabaseModule = TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        ...createTypeOrmOptions(configService),
    }),
});
