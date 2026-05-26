import { Request } from 'express'

import { UserDto } from '@auth/dtos/user.dto'

export interface ApiRequest extends Request {
  user?: UserDto
}
