import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ApiConfigModule } from '@api-config/api-config.module'
import { validate } from '@api-config/validate'
import { DataSourceConfig } from '@database/data-source'
import { HealthModule } from '@health/health.module'

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
})
export class AppModule {}
