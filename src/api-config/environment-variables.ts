import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsString, Max, Min, MinLength } from 'class-validator'

const toNumber = ({ value }: TransformFnParams): unknown => {
  if (!value) {
    return value as unknown
  }
  return Number(value)
}

export class EnvironmentVariables {
  @Transform(toNumber)
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number

  @IsString()
  @MinLength(1)
  DB_HOST: string

  @Transform(toNumber)
  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT: number

  @IsString()
  @MinLength(1)
  DB_NAME: string

  @IsString()
  @MinLength(1)
  DB_USER: string

  @IsString()
  @MinLength(1)
  DB_PASS: string
}
