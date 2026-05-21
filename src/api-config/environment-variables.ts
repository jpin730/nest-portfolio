import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator'

import { toNumber } from '@common/utils/to-number'

export class EnvironmentVariables {
  @Transform(toNumber)
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number

  @IsString()
  @IsNotEmpty()
  DB_HOST: string

  @Transform(toNumber)
  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT: number

  @IsString()
  @IsNotEmpty()
  DB_NAME: string

  @IsString()
  @IsNotEmpty()
  DB_USER: string

  @IsString()
  @IsNotEmpty()
  DB_PASS: string
}
