import { validateAndParse } from '@common/utils/validate-and-parse.util'

import { EnvsDto, MigrationEnvsDto } from '../dtos/envs.dto'

export const validateEnvs = (config: Record<string, unknown>): EnvsDto =>
  validateAndParse(EnvsDto, config)

export const validateMigrationEnvs = (
  config: Record<string, unknown>,
): Pick<EnvsDto, 'DB_HOST' | 'DB_PORT' | 'DB_NAME' | 'DB_USER' | 'DB_PASS'> => {
  const env = validateAndParse(MigrationEnvsDto, config)
  return {
    ...env,
    DB_USER: env.DB_MIG_USER,
    DB_PASS: env.DB_MIG_PASS,
  }
}
