import { Expose, Transform } from 'class-transformer'
import { IsJWT } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

import { TOKEN_CONFIG } from '../consts/token-config.const'

export class LoginResultDto {
  @Expose({ name: TOKEN_CONFIG.ACCESS_TOKEN.cookieName })
  @Transform(trimTransform)
  @IsJWT()
  accessToken: string

  @Expose({ name: TOKEN_CONFIG.REFRESH_TOKEN.cookieName })
  @Transform(trimTransform)
  @IsJWT()
  refreshToken: string
}
