import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator'

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
