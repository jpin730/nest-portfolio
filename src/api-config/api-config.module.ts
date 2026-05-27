import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiConfigService } from './services/api-config.service'
import { validateEnvs } from './utils/validate-envs.util'

@Global()
@Module({
  imports: [ConfigModule.forRoot({ validate: validateEnvs })],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
