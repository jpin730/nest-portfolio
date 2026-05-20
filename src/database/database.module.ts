import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DataSourceConfig } from './data-source'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...DataSourceConfig,
      logging: false,
    }),
  ],
})
export class DatabaseModule {}
