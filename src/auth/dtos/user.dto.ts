import { Exclude, Expose, Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length, MaxLength } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

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
  @IsNotEmpty()
  @Length(60)
  password: string
}
