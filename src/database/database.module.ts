import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ApiConfigModule } from '@api-config/api-config.module'
import { NodeEnv } from '@api-config/enums/node-env.enum'
import { ApiConfigService } from '@api-config/services/api-config.service'

import { DATA_SOURCE_OPTIONS } from './consts/data-source.const'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => {
        const env = apiConfigService.nodeEnv
        const logging = env !== NodeEnv.Production
        return { ...DATA_SOURCE_OPTIONS, logging }
      },
      inject: [ApiConfigService],
    }),
  ],
})
export class DatabaseModule {}
