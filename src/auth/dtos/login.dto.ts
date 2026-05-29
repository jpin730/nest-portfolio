import { PickType } from '@nestjs/mapped-types'
import { Exclude, Transform } from 'class-transformer'
import { IsString, Length } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

import { UserDto } from './user.dto'

export class LoginDto extends PickType(UserDto, ['email']) {
  @Exclude({ toPlainOnly: true })
  @Transform(trimTransform)
  @IsString()
  @Length(8, 20)
  password: string
}
