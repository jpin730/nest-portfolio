import { PickType } from '@nestjs/mapped-types'

import { UserDto } from './user.dto'

export class LoginDto extends PickType(UserDto, ['email', 'password']) {}
