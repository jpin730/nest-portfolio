import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { EnvironmentVariables, MigrationEnvironmentVariables } from './environment-variables'

const validateGeneric = <T extends object>(
  config: Record<string, unknown>,
  EnvironmentVariablesClass: new () => T,
): T => {
  const validatedConfig = plainToInstance(EnvironmentVariablesClass, config)

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}

export const validate = (config: Record<string, unknown>): EnvironmentVariables =>
  validateGeneric(config, EnvironmentVariables)

export const validateMigration = (
  config: Record<string, unknown>,
): Pick<EnvironmentVariables, 'DB_HOST' | 'DB_PORT' | 'DB_NAME' | 'DB_USER' | 'DB_PASS'> => {
  const env = validateGeneric(config, MigrationEnvironmentVariables)
  return {
    ...env,
    DB_USER: env.DB_MIG_USER,
    DB_PASS: env.DB_MIG_PASS,
  }
}
