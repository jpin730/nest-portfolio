import { validateAndParse } from '@common/utils/validate-and-parse'

import { EnvironmentVariables, MigrationEnvironmentVariables } from './environment-variables'

export const validate = (config: Record<string, unknown>): EnvironmentVariables =>
  validateAndParse(EnvironmentVariables, config)

export const validateMigration = (
  config: Record<string, unknown>,
): Pick<EnvironmentVariables, 'DB_HOST' | 'DB_PORT' | 'DB_NAME' | 'DB_USER' | 'DB_PASS'> => {
  const env = validateAndParse(MigrationEnvironmentVariables, config)
  return {
    ...env,
    DB_USER: env.DB_MIG_USER,
    DB_PASS: env.DB_MIG_PASS,
  }
}
