import { PartialType, PickType } from '@nestjs/mapped-types'

import { UserDto } from './user.dto'

export class PatchMeDto extends PartialType(PickType(UserDto, ['password'])) {}
