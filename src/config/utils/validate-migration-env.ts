import { validatePlanToInstance } from '@common/utils/validate-plan-to-instance.util'

import { DatabaseEnvDto } from '../dtos/database-env.dto'
import { MigrationEnvDto } from '../dtos/migration-env.dto'

export const validateMigrationEnvs = (config: Record<string, unknown>): DatabaseEnvDto => {
  const env = validatePlanToInstance(MigrationEnvDto, config)
  return validatePlanToInstance(DatabaseEnvDto, {
    ...env,
    DB_USER: env.DB_MIG_USER,
    DB_PASS: env.DB_MIG_PASS,
  })
}
