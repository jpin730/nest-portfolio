import { Expose, Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator'

import { numberTransform } from '@common/transforms/number.transform'
import { trimTransform } from '@common/transforms/trim.transform'

export class DatabaseEnvDto {
  @Expose()
  @Transform(trimTransform)
  @IsString()
  @IsNotEmpty()
  DB_HOST: string

  @Expose()
  @Transform(numberTransform)
  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT: number

  @Expose()
  @Transform(trimTransform)
  @IsString()
  @IsNotEmpty()
  DB_NAME: string

  @Expose()
  @Transform(trimTransform)
  @IsString()
  @IsNotEmpty()
  DB_USER: string

  @Expose()
  @Transform(trimTransform)
  @IsString()
  @IsNotEmpty()
  DB_PASS: string
}
