import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ApiConfigModule } from '@api-config/api-config.module'
import { ApiConfigService } from '@api-config/api-config.service'
import { Env } from '@api-config/enums/env.enum'

import { DATA_SOURCE_OPTIONS } from './consts/data-source.const'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => {
        const env = apiConfigService.env
        const logging = env !== Env.Production
        return { ...DATA_SOURCE_OPTIONS, logging }
      },
      inject: [ApiConfigService],
    }),
  ],
})
export class DatabaseModule {}
