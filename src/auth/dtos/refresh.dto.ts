import { PickType } from '@nestjs/mapped-types'

import { LoginResultDto } from './login-result.dto'

export class RefreshDto extends PickType(LoginResultDto, ['refreshToken']) {}
