import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from '@config/config.module'
import { ConfigService } from '@config/services/config.service'
import { NodeEnv } from 'src/config/enums/node-env.enum'

import { DATA_SOURCE_OPTIONS } from './consts/data-source.const'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const env = configService.nodeEnv
        const logging = env !== NodeEnv.Production
        return { ...DATA_SOURCE_OPTIONS, logging }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
