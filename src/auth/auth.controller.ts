import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'

import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { SetAuthCookiesInterceptor } from './interceptors/set-auth-cookies.interceptor'
import { LoginResult } from './interfaces/login-result'

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
}
