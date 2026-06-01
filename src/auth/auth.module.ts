import { Module } from '@nestjs/common'

import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { JwtService } from './services/jwt.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
