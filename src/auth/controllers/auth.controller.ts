import { Body, Controller, Patch, Post, Req } from '@nestjs/common'

import { AUTH_ERROR_MESSAGE } from '@auth/consts/auth-error-message.const'
import type { ApiRequest } from '@common/interfaces/api-request.interface'

import { CatchErrors } from '@common/decorators/catch-errors.decorator'
import { Public } from '../decorators/public.decorator'
import { LoginResultDto } from '../dtos/login-result.dto'
import { LoginDto } from '../dtos/login.dto'
import { PatchMeDto } from '../dtos/patch-me.dto'
import { RegisterDto } from '../dtos/register.dto'
import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @CatchErrors(AUTH_ERROR_MESSAGE.UNAVAILABLE_REGISTER)
  async register(@Body() body: RegisterDto): Promise<void> {
    await this.authService.register(body)
  }

  @Public()
  @Post('login')
  @CatchErrors(AUTH_ERROR_MESSAGE.UNAVAILABLE_LOGIN)
  async login(@Body() body: LoginDto): Promise<LoginResultDto> {
    return this.authService.login(body)
  }

  @Post('refresh')
  @CatchErrors(AUTH_ERROR_MESSAGE.UNAVAILABLE_REFRESH)
  async refresh(@Req() { authSession }: ApiRequest): Promise<LoginResultDto> {
    return this.authService.refresh(authSession!)
  }

  @Post('logout')
  @CatchErrors(AUTH_ERROR_MESSAGE.UNAVAILABLE_LOGOUT)
  async logout(@Req() { authSession }: ApiRequest): Promise<void> {
    await this.authService.logout(authSession!)
  }

  @Patch('me')
  @CatchErrors(AUTH_ERROR_MESSAGE.UNAVAILABLE_PATCH_ME)
  async updateMe(@Req() { authSession }: ApiRequest, @Body() body: PatchMeDto): Promise<void> {
    await this.authService.patchUser(authSession!.user.id, body)
  }
}
