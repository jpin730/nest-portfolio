import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Response } from 'express'
import { map, Observable } from 'rxjs'

import { NodeEnv } from '@api-config/enums/node-env.enum'
import { ApiConfigService } from '@api-config/services/api-config.service'

import { TOKEN_CONFIG, TOKEN_COOKIE_NAME, TokenConfig } from '../consts/token-config.const'
import { LoginResultDto } from '../dtos/login-result.dto'

@Injectable()
export class AuthCookiesInterceptor implements NestInterceptor {
  constructor(private readonly apiConfigService: ApiConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler<LoginResultDto | null>): Observable<null> {
    const response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((data) => {
        if (!data) {
          response.clearCookie(TOKEN_COOKIE_NAME.ACCESS_TOKEN)
          response.clearCookie(TOKEN_COOKIE_NAME.REFRESH_TOKEN)
          return null
        }

        const { accessToken, refreshToken } = data
        this.setCookie(response, accessToken, TOKEN_CONFIG.ACCESS_TOKEN)
        this.setCookie(response, refreshToken, TOKEN_CONFIG.REFRESH_TOKEN)
        return null
      }),
    )
  }

  private setCookie(response: Response, value: string, tokenConfig: TokenConfig): void {
    const maxAge = tokenConfig.expirationMin * 60 * 1000
    const env = this.apiConfigService.nodeEnv
    const secure = env === NodeEnv.Production
    response.cookie(tokenConfig.cookieName, value, {
      httpOnly: true,
      sameSite: 'strict',
      signed: true,
      secure,
      maxAge,
    })
  }
}
