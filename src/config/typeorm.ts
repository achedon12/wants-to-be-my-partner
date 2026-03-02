import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD', 'rootpassword'),
  database: configService.get<string>('DB_NAME', 'mydatabase'),
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  ssl: false,
  entities: [],
});
