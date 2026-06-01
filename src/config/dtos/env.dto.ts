import { Expose, Transform } from 'class-transformer'
import {
  IsBase64,
  IsEnum,
  IsHexadecimal,
  IsInt,
  IsNotEmpty,
  Length,
  Max,
  Min,
} from 'class-validator'

import { numberTransform } from '@common/transforms/number.transform'
import { trimTransform } from '@common/transforms/trim.transform'

import { NodeEnv } from '../enums/node-env.enum'
import { DatabaseEnvDto } from './database-env.dto'

export class EnvDto extends DatabaseEnvDto {
  @Expose()
  @Transform(trimTransform)
  @IsBase64()
  @IsNotEmpty()
  AUTH_JWT_PRIVATE_KEY: string

  @Expose()
  @Transform(trimTransform)
  @IsBase64()
  @IsNotEmpty()
  AUTH_JWT_PUBLIC_KEY: string

  @Expose()
  @Transform(numberTransform)
  @IsInt()
  @Min(12)
  AUTH_SALT_ROUNDS: number

  @Expose()
  @Transform(trimTransform)
  @IsHexadecimal()
  @Length(64)
  COOKIE_SECRET: string

  @Expose()
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv

  @Expose()
  @Transform(numberTransform)
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number
}
