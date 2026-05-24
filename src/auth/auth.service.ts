import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { compare, hash } from 'bcrypt'
import { Repository } from 'typeorm'

import { ApiConfigService } from '@api-config/api-config.service'
import { UserEntity } from '@database/entities/user.entity'

import { AUTH_MESSAGES } from './consts/messages'
import { TOKEN_EXPIRATION, TokenExpiration } from './consts/token-expiration'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { TokenPayload } from './interfaces/token-payload'

@Injectable()
export class AuthService {
  private isRegistrationEnable = false

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register({ email, password }: RegisterDto): Promise<void> {
    if (!this.isRegistrationEnable) {
      throw new NotFoundException()
    }

    const saltRounds = this.apiConfigService.authSaltRounds
    const hashedPassword = await hash(password, saltRounds)
    const user = this.userRepository.create({ email, password: hashedPassword })
    await this.userRepository.save(user)
    this.isRegistrationEnable = false
  }

  async login({ email, password }: LoginDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS)
    }

    const payload: TokenPayload = { sub: user.id }
    const accessToken = await this.generateToken(payload, TOKEN_EXPIRATION.ACCESS)
    const refreshToken = await this.generateToken(payload, TOKEN_EXPIRATION.REFRESH)

    console.info(accessToken)
    console.info(refreshToken)
  }

  private async generateToken<T extends object = object>(
    payload: T,
    expiresIn: TokenExpiration,
  ): Promise<string> {
    const secret = this.apiConfigService.jwtSecret
    return this.jwtService.signAsync<T>(payload, { secret, expiresIn })
  }
}
