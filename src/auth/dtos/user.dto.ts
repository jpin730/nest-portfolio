import { trimTransform } from '@common/transforms/trim.transform'
import { Exclude, Expose, Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length, Matches, MaxLength } from 'class-validator'

const PASSWORD_SPECIAL_CHARS = '@$!%*?&'

export class UserDto {
  @Expose()
  @Transform(trimTransform)
  @IsUUID()
  id: string

  @Expose()
  @Transform(trimTransform)
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string

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
