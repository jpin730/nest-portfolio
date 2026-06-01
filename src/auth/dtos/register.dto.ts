import { PickType } from '@nestjs/mapped-types'
import { Exclude, Transform } from 'class-transformer'
import { IsString, Length, Matches } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

import { UserDto } from './user.dto'

const PASSWORD_SPECIAL_CHARS = '@$!%*?&'

export class RegisterDto extends PickType(UserDto, ['email']) {
  @Exclude({ toPlainOnly: true })
  @Transform(trimTransform)
  @IsString()
  @Length(8, 20)
  @Matches(
    new RegExp(
      `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${PASSWORD_SPECIAL_CHARS}])[A-Za-z\\d${PASSWORD_SPECIAL_CHARS}]{8,}$`,
    ),
    {
      message: `password must contain at least one uppercase letter, one lowercase letter, one number and one special character: ${PASSWORD_SPECIAL_CHARS}`,
    },
  )
  password: string
}
