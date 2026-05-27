import { PickType } from '@nestjs/mapped-types'

import { LoginResultDto } from './login-result.dto'

export class LogoutDto extends PickType(LoginResultDto, ['refreshToken']) {}
