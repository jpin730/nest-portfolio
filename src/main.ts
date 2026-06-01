import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import { ConfigService } from '@config/services/config.service'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  // Configuration
  const { cookieSecret, port, nodeEnv } = app.get(ConfigService)

  // Middlewares
  app.use(morgan('tiny'))
  app.use(cookieParser(cookieSecret))

  // Initialization
  const logger = new Logger('Bootstrap')
  await app.listen(port)
  logger.log(`Environment: ${nodeEnv}`)
  logger.log(`App listening on port: ${port}`)
}
void bootstrap()
