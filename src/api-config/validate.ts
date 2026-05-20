import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

import { EnvironmentVariables } from './environment-variables'

export const validate = (config: Record<string, unknown>): EnvironmentVariables => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config)

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
