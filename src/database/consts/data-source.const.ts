import { config } from 'dotenv'
import { DataSource } from 'typeorm'

import { validateMigrationEnvs } from '@config/utils/validate-migration-env'

import { getDataSource } from '../utils/get-data-source.util'

config()

const databaseEnv = validateMigrationEnvs(process.env)
const dataSourceOptions = getDataSource(databaseEnv)

export const DATA_SOURCE = new DataSource({
  ...dataSourceOptions,
  migrations: [__dirname + '/../migrations/*.ts'],
  logging: true,
})
