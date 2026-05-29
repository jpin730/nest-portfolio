import { Expose, Transform, Type } from 'class-transformer'
import { IsDefined, IsJWT, IsNotEmptyObject, ValidateNested } from 'class-validator'

import { trimTransform } from '@common/transforms/trim.transform'

import { UserDto } from './user.dto'

export class AuthSessionDto {
  @Expose()
  @Transform(trimTransform)
  @IsJWT()
  token: string

  @Expose()
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto
}
