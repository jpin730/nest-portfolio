import { PickType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator'

import { numberTransform } from '@common/transforms/number.transform'

import { Env } from './env'

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  @Length(64)
  COOKIE_SECRET: string

  @IsEnum(Env)
  ENV: Env

  @Transform(numberTransform)
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number

  @IsString()
  @IsNotEmpty()
  DB_HOST: string

  @Transform(numberTransform)
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

  @IsString()
  @IsNotEmpty()
  @Length(64)
  AUTH_JWT_SECRET: string

  @Transform(numberTransform)
  @IsInt()
  @Min(12)
  AUTH_SALT_ROUNDS: number
}

export class MigrationEnvironmentVariables extends PickType(EnvironmentVariables, [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
] as const) {
  @IsString()
  @IsNotEmpty()
  DB_MIG_USER: string

  @IsString()
  @IsNotEmpty()
  DB_MIG_PASS: string
}
