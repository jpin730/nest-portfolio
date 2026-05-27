import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

import { ApiRequest } from '@common/interfaces/api-request.interface'

import { AUTH_ERROR_MESSAGE } from '../consts/auth-error-message.const'
import { TOKEN_COOKIE_NAME } from '../consts/token-config.const'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ApiRequest>()

    const token = request.signedCookies[TOKEN_COOKIE_NAME.ACCESS_TOKEN] as unknown

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.MISSING_ACCESS_TOKEN)
    }

    const payload = await this.authService.validateToken(token)
    const user = await this.authService.getUserFromTokenPayload(payload)

    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }

    request.user = user

    return true
  }
}
