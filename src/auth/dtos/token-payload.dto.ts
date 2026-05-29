import { Expose, Transform } from 'class-transformer'
import { IsNumber, IsPositive, IsUUID } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

export class TokenPayloadDto {
  @Expose()
  @Transform(trimTransform)
  @IsUUID()
  sub: string

  @Expose()
  @IsNumber()
  @IsPositive()
  exp: number
}
