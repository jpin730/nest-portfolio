import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from '@config/config.module'
import { NodeEnv } from '@config/enums/node-env.enum'
import { ConfigService } from '@config/services/config.service'
import { getDataSource } from './utils/get-data-source.util'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { databaseEnv, nodeEnv } = configService
        const dataSourceOptions = getDataSource(databaseEnv)
        const logging = nodeEnv !== NodeEnv.Production
        return { ...dataSourceOptions, logging }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
