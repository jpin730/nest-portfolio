import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvironmentVariables } from './environment-variables'

interface Database {
  host: string
  port: number
  database: string
  username: string
  password: string
}

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  get port(): number {
    return this.configService.get('PORT', { infer: true })
  }

  get database(): Database {
    const host = this.configService.get('DB_HOST', { infer: true })
    const port = this.configService.get('DB_PORT', { infer: true })
    const database = this.configService.get('DB_NAME', { infer: true })
    const username = this.configService.get('DB_USER', { infer: true })
    const password = this.configService.get('DB_PASS', { infer: true })
    return { host, port, database, username, password }
  }

  get authSaltRounds(): number {
    return this.configService.get('AUTH_SALT_ROUNDS', { infer: true })
  }

  get jwtSecret(): string {
    return this.configService.get('AUTH_JWT_SECRET', { infer: true })
  }
}
