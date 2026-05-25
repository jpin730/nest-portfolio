import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const SignedCookies = createParamDecorator(
  (cookieName: string | null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    const cookies: Record<string, unknown> = request.signedCookies
    return cookieName ? cookies[cookieName] : cookies
  },
)
