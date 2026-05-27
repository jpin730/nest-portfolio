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
import { DataSource, LessThan, MoreThan } from 'typeorm'

import { ApiConfigService } from '@api-config/api-config.service'
import { ERROR_MESSAGE } from '@common/consts/error-message.const'
import { hasAnyProperty } from '@common/utils/has-any-property.util'
import { validatePlanToInstance } from '@common/utils/validate-plan-to-instance.util'
import { RefreshTokenEntity } from '@database/entities/refresh-token.entity'
import { UserEntity } from '@database/entities/user.entity'

import { plainToInstance } from 'class-transformer'
import { AUTH_ERROR_MESSAGE } from './consts/auth-error-message.const'
import { TOKEN_CONFIG, TokenConfig } from './consts/token-config.const'
import { LoginResultDto } from './dtos/login-result.dto'
import { LoginDto } from './dtos/login.dto'
import { LogoutDto } from './dtos/logout.dto'
import { PatchMeDto } from './dtos/patch-me.dto'
import { RefreshDto } from './dtos/refresh.dto'
import { RegisterDto } from './dtos/register.dto'
import { TokenPayloadDto } from './dtos/token-payload.dto'
import { UserDto } from './dtos/user.dto'
import { hashToken } from './utils/hash-token.util'

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
      throw new ForbiddenException(AUTH_ERROR_MESSAGE.REGISTRATION_DISABLED)
    }

    const existingUser = await this.dataSource.manager.findOne(UserEntity, { where: { email } })

    if (existingUser) {
      throw new BadRequestException(AUTH_ERROR_MESSAGE.EMAIL_ALREADY_EXISTS)
    }

    const hashedPassword = await this.hashPassword(password)

    await this.dataSource.transaction(async (entityManager) => {
      const user = entityManager.create(UserEntity, { email, password: hashedPassword })
      await entityManager.save(user)
    })

    this.isRegistrationEnable = false
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

    const [accessToken, refreshToken] = await this.generateTokenPair({ sub: user.id })
    await this.storeRefreshToken(refreshToken)
    return { accessToken, refreshToken }
  }

  async refresh({ refreshToken: oldRefreshToken }: RefreshDto): Promise<LoginResultDto> {
    const { sub } = await this.validateToken(oldRefreshToken)

    const storedRefreshToken = await this.dataSource.manager.findOne(RefreshTokenEntity, {
      where: {
        tokenHash: hashToken(oldRefreshToken),
        expiresAt: MoreThan(new Date()),
        userId: sub,
      },
    })

    if (!storedRefreshToken) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }

    const [accessToken, refreshToken] = await this.generateTokenPair({ sub })
    await this.storeRefreshToken(refreshToken, storedRefreshToken.id)
    return { accessToken, refreshToken }
  }

  async logout({ refreshToken }: LogoutDto): Promise<void> {
    const { sub } = await this.validateToken(refreshToken)
    const storedRefreshToken = await this.dataSource.manager.findOne(RefreshTokenEntity, {
      where: {
        tokenHash: hashToken(refreshToken),
        expiresAt: MoreThan(new Date()),
        userId: sub,
      },
    })

    if (!storedRefreshToken) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }

    await this.dataSource.transaction(async (entityManager) => {
      const id = storedRefreshToken.id
      await entityManager.delete(RefreshTokenEntity, { id })
    })
  }

  async validateToken(token: string): Promise<TokenPayloadDto> {
    const secret = this.apiConfigService.authJwtSecret
    const rawPayload: unknown = await this.jwtService.verifyAsync(token, { secret })
    return validatePlanToInstance(TokenPayloadDto, rawPayload)
  }

  async getUserFromTokenPayload({ sub: id }: TokenPayloadDto): Promise<UserDto> {
    const user = await this.dataSource.manager.findOne(UserEntity, { where: { id } })
    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIALS)
    }
    return plainToInstance(UserDto, user)
  }

  async patchUser(id: string, patchMeDto: PatchMeDto): Promise<void> {
    if (!hasAnyProperty(patchMeDto)) {
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
    const saltRounds = this.apiConfigService.authSaltRounds
    return hash(password, saltRounds)
  }

  private async generateTokenPair(payload: Partial<TokenPayloadDto>): Promise<[string, string]> {
    const accessToken = await this.generateToken(payload, TOKEN_CONFIG.ACCESS_TOKEN)
    const refreshToken = await this.generateToken(payload, TOKEN_CONFIG.REFRESH_TOKEN)
    return [accessToken, refreshToken]
  }

  private async generateToken<T extends object = object>(
    payload: T,
    tokenConfig: TokenConfig,
  ): Promise<string> {
    const secret = this.apiConfigService.authJwtSecret
    const expiresIn = tokenConfig.expirationMin * 60
    return this.jwtService.signAsync<T>(payload, { secret, expiresIn })
  }

  private async storeRefreshToken(token: string, oldTokenId?: string): Promise<void> {
    const tokenHash = hashToken(token)
    const { sub: userId, exp } = this.jwtService.decode<TokenPayloadDto>(token)

    await this.dataSource.transaction(async (entityManager) => {
      const refreshToken = entityManager.create(RefreshTokenEntity, {
        userId,
        tokenHash,
        expiresAt: new Date(exp * 1000),
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
      this.logger.log(`Cleaned up ${affected} expired refresh tokens`)
    })
  }
}
