import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { ConfigModule } from '@config/config.module'
import { DatabaseModule } from '@database/database.module'

import { AuthModule } from '@auth/auth.module'
import { HealthModule } from '@health/health.module'

import { AUTH_GUARD_PROVIDER } from '@common/providers/auth-guard.provider'
import { CLASS_SERIALIZER_INTERCEPTOR_PROVIDER } from '@common/providers/class-serializer-interceptor.provider'
import { GLOBAL_EXCEPTION_FILTER_PROVIDER } from '@common/providers/global-exception-filter.provider'
import { GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER } from '@common/providers/global-response-interceptor.provider'
import { VALIDATION_PIPE_PROVIDER } from '@common/providers/validation-pipe.provider'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ScheduleModule.forRoot(),

    // Features
    AuthModule,
    HealthModule,
  ],
  providers: [
    AUTH_GUARD_PROVIDER,
    CLASS_SERIALIZER_INTERCEPTOR_PROVIDER,
    GLOBAL_EXCEPTION_FILTER_PROVIDER,
    GLOBAL_RESPONSE_INTERCEPTOR_PROVIDER,
    VALIDATION_PIPE_PROVIDER,
  ],
})
export class AppModule {}
