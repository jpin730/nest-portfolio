import { IsInt, IsNumber, IsPositive, IsUUID } from 'class-validator'

export class TokenPayload {
  @IsUUID()
  sub?: string

  @IsInt()
  @IsPositive()
  iat?: number

  @IsNumber()
  @IsPositive()
  exp?: number
}
