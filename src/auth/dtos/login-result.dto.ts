import { Expose, Transform } from 'class-transformer'
import { IsJWT } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

export class LoginResultDto {
  @Expose()
  @Transform(trimTransform)
  @IsJWT()
  accessToken: string

  @Expose()
  @Transform(trimTransform)
  @IsJWT()
  refreshToken: string
}
