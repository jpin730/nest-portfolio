import { validatePlanToInstance } from '@common/utils/validate-plan-to-instance.util'

import { EnvDto } from '../dtos/env.dto'

export const validateEnvs = (config: Record<string, unknown>): EnvDto =>
  validatePlanToInstance(EnvDto, config)
