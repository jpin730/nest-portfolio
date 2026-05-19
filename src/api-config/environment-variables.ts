import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator'

export class EnvironmentVariables {
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT!: number

  @IsString()
  @MinLength(1)
  DB_HOST!: string

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT!: number

  @IsString()
  @MinLength(1)
  DB_NAME!: string

  @IsString()
  @MinLength(1)
  DB_USER!: string

  @IsString()
  @MinLength(1)
  DB_PASS!: string
}
