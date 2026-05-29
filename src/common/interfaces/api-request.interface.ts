import { Request } from 'express'

import { AuthSessionDto } from '@auth/dtos/auth-session.dto'

export interface ApiRequest extends Request {
  authSession?: AuthSessionDto
}
