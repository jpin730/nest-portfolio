import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

import { DatabaseEnvDto } from '../dtos/database-env.dto'
import { EnvDto } from '../dtos/env.dto'
import { NodeEnv } from '../enums/node-env.enum'

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService<EnvDto, true>) {}

  get authJwtPrivateKey(): string {
    return this.configService.get('AUTH_JWT_PRIVATE_KEY', { infer: true })
  }

  get authJwtPublicKey(): string {
    return this.configService.get('AUTH_JWT_PUBLIC_KEY', { infer: true })
  }

  get authSaltRounds(): number {
    return this.configService.get('AUTH_SALT_ROUNDS', { infer: true })
  }

  get cookieSecret(): string {
    return this.configService.get('COOKIE_SECRET', { infer: true })
  }

  get databaseEnv(): DatabaseEnvDto {
    const DB_HOST = this.configService.get('DB_HOST', { infer: true })
    const DB_PORT = this.configService.get('DB_PORT', { infer: true })
    const DB_NAME = this.configService.get('DB_NAME', { infer: true })
    const DB_USER = this.configService.get('DB_USER', { infer: true })
    const DB_PASS = this.configService.get('DB_PASS', { infer: true })
    return { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS }
  }

  get nodeEnv(): NodeEnv {
    return this.configService.get('NODE_ENV', { infer: true })
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true })
  }
}
