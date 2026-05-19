import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.NO_CONTENT)
  check(): void {}
}
