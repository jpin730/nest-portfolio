import { DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { DatabaseEnvDto } from '@config/dtos/database-env.dto'

export const getDataSource = (env: DatabaseEnvDto): DataSourceOptions => {
  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    synchronize: false,
    entities: [__dirname + '/../entities/*.entity.{ts,js}'],
    namingStrategy: new SnakeNamingStrategy(),
  }
}
