import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiConfigModule } from '@api-config/api-config.module'
import { validate } from '@api-config/validate'
import { HealthModule } from '@health/health.module'

@Module({
  imports: [ConfigModule.forRoot({ validate }), ApiConfigModule, HealthModule],
})
export class AppModule {}
