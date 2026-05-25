import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'

import { SignedCookies } from '@common/decorators/signed-cookies.decorator'

import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { LogoutDto } from './dtos/logout.dto'
import { RefreshDto } from './dtos/refresh.dto'
import { RegisterDto } from './dtos/register.dto'
import { SetAuthCookiesInterceptor } from './interceptors/set-auth-cookies.interceptor'
import { LoginResult } from './interfaces/login-result.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<void> {
    await this.authService.register(body)
  }

  @Post('login')
  @UseInterceptors(SetAuthCookiesInterceptor)
  async login(@Body() body: LoginDto): Promise<LoginResult> {
    return await this.authService.login(body)
  }

  @Post('refresh')
  @UseInterceptors(SetAuthCookiesInterceptor)
  async refresh(@SignedCookies() cookies: RefreshDto): Promise<LoginResult> {
    return await this.authService.refresh(cookies)
  }

  @Post('logout')
  @UseInterceptors(SetAuthCookiesInterceptor)
  async logout(@SignedCookies() cookies: LogoutDto): Promise<void> {
    await this.authService.logout(cookies)
  }
}
