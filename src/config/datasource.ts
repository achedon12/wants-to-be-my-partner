import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './typeorm';

const configService = new ConfigService();

export const AppDataSource = new DataSource(typeOrmConfig(configService));
