import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ApiConfigModule } from '@api-config/api-config.module'
import { ApiConfigService } from '@api-config/api-config.service'
import { validate } from '@api-config/validate'
import { HealthModule } from '@health/health.module'

@Module({
  imports: [
    // Configs & Database
    ConfigModule.forRoot({ validate }),
    ApiConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => ({
        type: 'postgres',
        ssl: true,
        extra: {
          channelBinding: 'required',
        },
        ...apiConfigService.database,
        autoLoadEntities: true,
        retryAttempts: 0,
      }),
      inject: [ApiConfigService],
    }),

    // Features
    HealthModule,
  ],
})
export class AppModule {}
