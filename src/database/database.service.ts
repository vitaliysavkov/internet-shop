import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const createTypeOrmOptions = (config: ConfigService): TypeOrmModuleOptions => {
    return {
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        entities: ['dist/**/*.entity.{ts,js}'],
        migrations: ['dist/migrations/*.{ts,js}'],
        migrationsTableName: 'typeorm_migrations',
        logger: 'simple-console',
        synchronize: true, // never use TRUE in production!
    };
}