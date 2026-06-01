import { ClassProvider } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { AuthGuard } from '@auth/guards/auth.guard'

export const AUTH_GUARD_PROVIDER: ClassProvider<AuthGuard> = {
  provide: APP_GUARD,
  useClass: AuthGuard,
}
