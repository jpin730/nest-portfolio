import { Expose } from 'class-transformer'
import { IsNumber, IsPositive, IsUUID } from 'class-validator'

export class TokenPayloadDto {
  @Expose()
  @IsUUID()
  sub: string

  @Expose()
  @IsNumber()
  @IsPositive()
  exp: number
}
