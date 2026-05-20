import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ApiConfigModule } from '@api-config/api-config.module'

import { validate } from '@api-config/validate'
import { DataSourceConfig } from '@database/data-source'

import { HealthModule } from '@health/health.module'

import { GLOBAL_EXCEPTION_FILTER_PROVIDER } from '@common/global-exception.filter'
import { GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER } from '@common/global-response.interceptor'

@Module({
  imports: [
    // Configs & Database
    ConfigModule.forRoot({ validate }),
    ApiConfigModule,
    TypeOrmModule.forRoot({
      ...DataSourceConfig,
      logging: false,
    }),

    // Features
    HealthModule,
  ],
  providers: [GLOBAL_EXCEPTION_FILTER_PROVIDER, GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER],
})
export class AppModule {}
