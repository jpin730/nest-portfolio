import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiConfigService } from './api-config.service'
import { validate } from './validate'

@Global()
@Module({
  imports: [ConfigModule.forRoot({ validate })],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
