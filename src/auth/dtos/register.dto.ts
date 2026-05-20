import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

export class RegisterDto {
  @Transform(trimTransform)
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string

  @Transform(trimTransform)
  @IsString()
  @Length(8, 20)
  password: string
}
