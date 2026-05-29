import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { isJWT } from 'class-validator'

import { ApiRequest } from '@common/interfaces/api-request.interface'

import { AUTH_ERROR_MESSAGE } from '../consts/auth-error-message.const'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: add logic for public routes
    const request = context.switchToHttp().getRequest<ApiRequest>()
    const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.at(1)
    if (!token || typeof token !== 'string' || !isJWT(token)) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }
    request.authSession = await this.authService.validateToken(token)
    return true
  }
}
