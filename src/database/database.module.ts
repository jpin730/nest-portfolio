import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ApiConfigModule } from '@api-config/api-config.module'
import { ApiConfigService } from '@api-config/api-config.service'
import { Env } from '@api-config/env'

import { DataSourceConfig } from './data-source'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => {
        const env = apiConfigService.env
        const logging = env !== Env.PRODUCTION
        return { ...DataSourceConfig, logging }
      },
      inject: [ApiConfigService],
    }),
  ],
})
export class DatabaseModule {}
