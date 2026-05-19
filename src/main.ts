import { NestFactory } from '@nestjs/core'
import morgan from 'morgan'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.use(morgan('tiny'))

  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
