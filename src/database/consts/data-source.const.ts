import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { validateEnvs, validateMigrationEnvs } from 'src/config/utils/validate-envs.util'

config()

const isMigration = process.env.MIGRATION === 'true'
const env = isMigration ? validateMigrationEnvs(process.env) : validateEnvs(process.env)

// TODO: create factory function
export const DATA_SOURCE_OPTIONS: DataSourceOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  entities: [__dirname + '/../entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
}

export const DATA_SOURCE = new DataSource(DATA_SOURCE_OPTIONS)
