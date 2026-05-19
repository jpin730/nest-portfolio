import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import morgan from 'morgan'

import { ApiConfigService } from '@api-config/api-config.service'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.use(morgan('tiny'))

  const logger = new Logger('Bootstrap')
  const apiConfigService = app.get(ApiConfigService)

  const port = apiConfigService.port
  logger.log(`Listening on port ${port}`)
  await app.listen(port)
}
void bootstrap()
