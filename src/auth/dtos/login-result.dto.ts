import { Expose } from 'class-transformer'
import { IsJWT } from 'class-validator'

import { TOKEN_CONFIG } from '../consts/token-config.const'

export class LoginResultDto {
  @Expose({ name: TOKEN_CONFIG.ACCESS_TOKEN.cookieName })
  @IsJWT()
  accessToken: string

  @Expose({ name: TOKEN_CONFIG.REFRESH_TOKEN.cookieName })
  @IsJWT()
  refreshToken: string
}
