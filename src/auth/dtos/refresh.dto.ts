import { Expose } from 'class-transformer'
import { IsJWT } from 'class-validator'

import { TOKEN_CONFIG } from '@auth/consts/token-config.const'

export class RefreshDto {
  @IsJWT()
  @Expose({ name: TOKEN_CONFIG.REFRESH_TOKEN.cookieName })
  refreshToken: string
}
