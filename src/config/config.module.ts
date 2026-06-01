import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'

import { ConfigService } from './services/config.service'
import { validateEnvs } from './utils/validate-env.util'

@Global()
@Module({
  imports: [NestConfigModule.forRoot({ validate: validateEnvs })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
