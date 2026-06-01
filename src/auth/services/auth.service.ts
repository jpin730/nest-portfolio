import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { compare, hash } from 'bcrypt'
import { DataSource, LessThan, MoreThan } from 'typeorm'

import { ERROR_MESSAGE } from '@common/consts/error-message.const'
import { validatePlanToInstance } from '@common/utils/validate-plan-to-instance.util'
import { ConfigService } from '@config/services/config.service'
import { RefreshTokenEntity } from '@database/entities/refresh-token.entity'
import { UserEntity } from '@database/entities/user.entity'

import { AUTH_ERROR_MESSAGE } from '../consts/auth-error-message.const'
import { AuthSessionDto } from '../dtos/auth-session.dto'
import { LoginResultDto } from '../dtos/login-result.dto'
import { LoginDto } from '../dtos/login.dto'
import { PatchMeDto } from '../dtos/patch-me.dto'
import { RegisterDto } from '../dtos/register.dto'
import { TokenPayloadDto } from '../dtos/token-payload.dto'
import { hashToken } from '../utils/hash-token.util'
import { JwtService } from './jwt.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password }: RegisterDto): Promise<void> {
    const existingUser = await this.dataSource.manager.findOne(UserEntity, { where: { email } })
    if (existingUser) {
      throw new BadRequestException(AUTH_ERROR_MESSAGE.EMAIL_ALREADY_EXISTS)
    }

    const hashedPassword = await this.hashPassword(password)
    await this.dataSource.transaction(async (entityManager) => {
      const user = entityManager.create(UserEntity, { email, password: hashedPassword })
      await entityManager.save(user)
    })
  }

  async login({ email, password }: LoginDto): Promise<LoginResultDto> {
    const user = await this.dataSource.manager.findOne(UserEntity, { where: { email } })
    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }

    const [accessToken, refreshToken] = await this.generateTokenPair(user.id)
    await this.storeRefreshToken(refreshToken)
    return validatePlanToInstance(LoginResultDto, { accessToken, refreshToken })
  }

  async refresh({
    token: oldRefreshToken,
    user: { id: userId },
  }: AuthSessionDto): Promise<LoginResultDto> {
    const { id } = await this.getStoredRefreshToken(oldRefreshToken, userId)
    const [accessToken, refreshToken] = await this.generateTokenPair(userId)
    await this.storeRefreshToken(refreshToken, id)
    return validatePlanToInstance(LoginResultDto, { accessToken, refreshToken })
  }

  async logout({ token: refreshToken, user: { id: userId } }: AuthSessionDto): Promise<void> {
    const { id } = await this.getStoredRefreshToken(refreshToken, userId)
    await this.dataSource.transaction(async (entityManager) => {
      await entityManager.delete(RefreshTokenEntity, { id, userId })
    })
  }

  async validateToken(token: string): Promise<AuthSessionDto> {
    const rawPayload = await this.jwtService.verifyAsync(token)
    const { sub: id } = validatePlanToInstance(TokenPayloadDto, rawPayload)
    const user = await this.dataSource.manager.findOne(UserEntity, { where: { id } })
    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }
    return validatePlanToInstance(AuthSessionDto, { token, user })
  }

  async patchUser(id: string, patchMeDto: PatchMeDto): Promise<void> {
    if (Object.keys(patchMeDto).length === 0) {
      throw new BadRequestException(ERROR_MESSAGE.NO_FIELDS_TO_UPDATE)
    }
    if (patchMeDto.password) {
      patchMeDto.password = await this.hashPassword(patchMeDto.password)
    }
    await this.dataSource.transaction(async (entityManager) => {
      await entityManager.update(UserEntity, { id }, patchMeDto)
    })
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.authSaltRounds
    return hash(password, saltRounds)
  }

  private async generateTokenPair(sub: string): Promise<[string, string]> {
    const accessToken = await this.jwtService.sign(sub, '5minutes')
    const refreshToken = await this.jwtService.sign(sub, '1day')
    return [accessToken, refreshToken]
  }

  private async getStoredRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<RefreshTokenEntity> {
    const storedRefreshToken = await this.dataSource.manager.findOne(RefreshTokenEntity, {
      where: {
        tokenHash: hashToken(refreshToken),
        expiresAt: MoreThan(new Date()),
        userId,
      },
    })
    if (!storedRefreshToken) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }
    return storedRefreshToken
  }

  private async storeRefreshToken(token: string, oldTokenId?: string): Promise<void> {
    const rawPayload = this.jwtService.decode(token)
    const { sub: userId, exp } = validatePlanToInstance(TokenPayloadDto, rawPayload)
    const tokenHash = hashToken(token)
    const expiresAt = new Date(exp * 1000)
    await this.dataSource.transaction(async (entityManager) => {
      const refreshToken = entityManager.create(RefreshTokenEntity, {
        userId,
        tokenHash,
        expiresAt,
      })
      await entityManager.save(refreshToken)
      if (oldTokenId) {
        await entityManager.delete(RefreshTokenEntity, { id: oldTokenId })
      }
    })
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokens(): Promise<void> {
    await this.dataSource.transaction(async (entityManager) => {
      const { affected } = await entityManager.delete(RefreshTokenEntity, {
        expiresAt: LessThan(new Date()),
      })
      if (affected && affected > 0) {
        this.logger.log(`Cleaned up ${affected} expired refresh tokens`)
      }
    })
  }
}
