import { validatePlanToInstance } from '@common/utils/validate-plan-to-instance.util'

import { EnvsDto, MigrationEnvsDto } from '../dtos/envs.dto'

export const validateEnvs = (config: Record<string, unknown>): EnvsDto =>
  validatePlanToInstance(EnvsDto, config)

export const validateMigrationEnvs = (
  config: Record<string, unknown>,
): Pick<EnvsDto, 'DB_HOST' | 'DB_PORT' | 'DB_NAME' | 'DB_USER' | 'DB_PASS'> => {
  const env = validatePlanToInstance(MigrationEnvsDto, config)
  return {
    ...env,
    DB_USER: env.DB_MIG_USER,
    DB_PASS: env.DB_MIG_PASS,
  }
}
