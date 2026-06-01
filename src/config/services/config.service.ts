import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

import { EnvsDto } from '../dtos/envs.dto'
import { NodeEnv } from '../enums/node-env.enum'

interface Database {
  host: string
  port: number
  database: string
  username: string
  password: string
}

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService<EnvsDto, true>) {}

  get authJwtSecret(): string {
    return this.configService.get('AUTH_JWT_SECRET', { infer: true })
  }

  get authSaltRounds(): number {
    return this.configService.get('AUTH_SALT_ROUNDS', { infer: true })
  }

  get cookieSecret(): string {
    return this.configService.get('COOKIE_SECRET', { infer: true })
  }

  get database(): Database {
    const host = this.configService.get('DB_HOST', { infer: true })
    const port = this.configService.get('DB_PORT', { infer: true })
    const database = this.configService.get('DB_NAME', { infer: true })
    const username = this.configService.get('DB_USER', { infer: true })
    const password = this.configService.get('DB_PASS', { infer: true })
    return { host, port, database, username, password }
  }

  get nodeEnv(): NodeEnv {
    return this.configService.get('NODE_ENV', { infer: true })
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true })
  }
}
