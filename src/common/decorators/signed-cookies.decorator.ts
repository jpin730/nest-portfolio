import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { ApiRequest } from '@common/interfaces/api-request.interface'

export const SignedCookies = createParamDecorator(
  (cookieName: string | null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ApiRequest>()
    const cookies: Record<string, unknown> = request.signedCookies
    return cookieName ? cookies[cookieName] : cookies
  },
)
