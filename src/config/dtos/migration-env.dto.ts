import { Expose, Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

import { DatabaseEnvDto } from './database-env.dto'

export class MigrationEnvDto extends DatabaseEnvDto {
  @Expose()
  @Transform(trimTransform)
  @IsString()
  @IsNotEmpty()
  DB_MIG_USER: string

  @Expose()
  @Transform(trimTransform)
  @IsString()
  @IsNotEmpty()
  DB_MIG_PASS: string
}
