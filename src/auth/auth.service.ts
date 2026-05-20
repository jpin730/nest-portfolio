import { Injectable } from '@nestjs/common'

import { RegisterDto } from './dtos/register.dto'

@Injectable()
export class AuthService {
  register(registerDto: RegisterDto): void {
    throw new Error(`Email ${registerDto.email} is already in use`)
  }
}
