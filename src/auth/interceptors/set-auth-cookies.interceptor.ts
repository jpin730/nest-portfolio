import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Response } from 'express'
import { map, Observable } from 'rxjs'

import { ApiConfigService } from '@api-config/api-config.service'
import { Env } from '@api-config/env'

import { TOKEN_CONFIG, TokenConfig } from '../consts/token-config'
import { LoginResult } from '../interfaces/login-result'

@Injectable()
export class SetAuthCookiesInterceptor implements NestInterceptor {
  constructor(private readonly apiConfigService: ApiConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler<LoginResult | null>): Observable<null> {
    const response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((data) => {
        if (!data) {
          response.clearCookie(TOKEN_CONFIG.ACCESS_TOKEN.cookieName)
          response.clearCookie(TOKEN_CONFIG.REFRESH_TOKEN.cookieName)
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
    const env = this.apiConfigService.env
    const secure = env === Env.PRODUCTION
    response.cookie(tokenConfig.cookieName, value, {
      httpOnly: true,
      sameSite: 'strict',
      signed: true,
      secure,
      maxAge,
    })
  }
}
