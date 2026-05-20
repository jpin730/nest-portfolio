import { Module } from '@nestjs/common'

import { ApiConfigModule } from '@api-config/api-config.module'
import { DatabaseModule } from '@database/database.module'

import { HealthModule } from '@health/health.module'

import { GLOBAL_EXCEPTION_FILTER_PROVIDER } from '@common/global-exception.filter'
import { GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER } from '@common/global-response.interceptor'

@Module({
  imports: [
    ApiConfigModule,
    DatabaseModule,

    // Features
    HealthModule,
  ],
  providers: [GLOBAL_EXCEPTION_FILTER_PROVIDER, GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER],
})
export class AppModule {}
