import { Public } from '@auth/decorators/public.decorator'
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @HttpCode(HttpStatus.NO_CONTENT)
  check(): void {}
}
