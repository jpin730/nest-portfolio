import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { ApiConfigModule } from '@api-config/api-config.module'
import { DatabaseModule } from '@database/database.module'

import { AuthModule } from '@auth/auth.module'
import { HealthModule } from '@health/health.module'

import { GLOBAL_EXCEPTION_FILTER_PROVIDER } from '@common/global-exception.filter'
import { GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER } from '@common/global-response.interceptor'
import { VALIDATION_PIPE_PROVIDER } from '@common/validation-pipe.provider'

@Module({
  imports: [
    ApiConfigModule,
    DatabaseModule,
    ScheduleModule.forRoot(),

    // Features
    AuthModule,
    HealthModule,
  ],
  providers: [
    GLOBAL_EXCEPTION_FILTER_PROVIDER,
    GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER,
    VALIDATION_PIPE_PROVIDER,
  ],
})
export class AppModule {}
