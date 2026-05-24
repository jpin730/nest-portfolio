import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from '@database/entities/user.entity'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
