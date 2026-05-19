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
    const port = this.configService.get('PORT', { infer: true })
    return port
  }

  get database(): Database {
    const host = this.configService.get('DB_HOST', { infer: true })
    const port = this.configService.get('DB_PORT', { infer: true })
    const database = this.configService.get('DB_NAME', { infer: true })
    const username = this.configService.get('DB_USER', { infer: true })
    const password = this.configService.get('DB_PASS', { infer: true })
    return { host, port, database, username, password }
  }
}
