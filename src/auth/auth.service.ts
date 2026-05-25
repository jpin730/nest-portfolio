import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Cron, CronExpression } from '@nestjs/schedule'
import { compare, hash } from 'bcrypt'
import { DataSource, LessThan } from 'typeorm'

import { ApiConfigService } from '@api-config/api-config.service'
import { RefreshTokenEntity } from '@database/entities/refresh-token.entity'
import { UserEntity } from '@database/entities/user.entity'

import { AUTH_MESSAGE } from './consts/message'
import { TOKEN_CONFIG, TokenConfig } from './consts/token-config'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { LoginResult } from './interfaces/login-result'
import { TokenPayload } from './interfaces/token-payload'
import { hashToken } from './utils/hash-token'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private isRegistrationEnable = false

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password }: RegisterDto): Promise<void> {
    if (!this.isRegistrationEnable) {
      throw new ForbiddenException(AUTH_MESSAGE.REGISTRATION_DISABLED)
    }

    const existingUser = await this.dataSource.manager.findOne(UserEntity, {
      where: { email },
    })

    if (existingUser) {
      throw new BadRequestException(AUTH_MESSAGE.EMAIL_ALREADY_EXISTS)
    }

    const saltRounds = this.apiConfigService.authSaltRounds
    const hashedPassword = await hash(password, saltRounds)

    await this.dataSource.transaction(async (entityManager) => {
      const user = entityManager.create(UserEntity, { email, password: hashedPassword })
      await entityManager.save(user)
    })

    this.isRegistrationEnable = false
  }

  async login({ email, password }: LoginDto): Promise<LoginResult> {
    const user = await this.dataSource.manager.findOne(UserEntity, {
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS)
    }

    const payload: TokenPayload = { sub: user.id }
    const accessToken = await this.generateToken(payload, TOKEN_CONFIG.ACCESS_TOKEN)
    const refreshToken = await this.generateToken(payload, TOKEN_CONFIG.REFRESH_TOKEN)

    await this.storeRefreshToken(refreshToken)

    return { accessToken, refreshToken }
  }

  private async generateToken<T extends object = object>(
    payload: T,
    tokenConfig: TokenConfig,
  ): Promise<string> {
    const secret = this.apiConfigService.authJwtSecret
    const expiresIn = tokenConfig.expirationMin * 60
    return this.jwtService.signAsync<T>(payload, { secret, expiresIn })
  }

  private async storeRefreshToken(token: string): Promise<void> {
    const tokenHash = hashToken(token)
    const { sub: userId, exp } = this.jwtService.decode<Required<TokenPayload>>(token)

    await this.dataSource.transaction(async (entityManager) => {
      const refreshTokenEntity = entityManager.create(RefreshTokenEntity, {
        userId,
        tokenHash,
        expiresAt: new Date(exp * 1000),
      })
      await entityManager.save(refreshTokenEntity)
    })
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokens(): Promise<void> {
    await this.dataSource.transaction(async (entityManager) => {
      const { affected } = await entityManager.delete(RefreshTokenEntity, {
        expiresAt: LessThan(new Date()),
      })
      this.logger.log(`Cleaned up ${affected} expired refresh tokens`)
    })
  }
}
