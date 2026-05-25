import { IsNumber, IsPositive, IsUUID } from 'class-validator'
import { TokenPayload } from '../interfaces/token-payload.interface'

export class TokenPayloadDto implements TokenPayload {
  @IsUUID()
  sub: string

  @IsNumber()
  @IsPositive()
  exp: number
}
