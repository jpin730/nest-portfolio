import { PartialType, PickType } from '@nestjs/mapped-types'

import { RegisterDto } from './register.dto'

export class PatchMeDto extends PartialType(PickType(RegisterDto, ['password'])) {}
