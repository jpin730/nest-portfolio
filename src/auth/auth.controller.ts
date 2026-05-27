import { Body, Controller, Get, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'

import { SignedCookies } from '@common/decorators/signed-cookies.decorator'
import type { ApiRequest } from '@common/interfaces/api-request.interface'

import { AuthService } from './auth.service'
import { LoginResultDto } from './dtos/login-result.dto'
import { LoginDto } from './dtos/login.dto'
import { LogoutDto } from './dtos/logout.dto'
import { PatchMeDto } from './dtos/patch-me.dto'
import { RefreshDto } from './dtos/refresh.dto'
import { RegisterDto } from './dtos/register.dto'
import { UserDto } from './dtos/user.dto'
import { AuthGuard } from './guards/auth.guard'
import { AuthCookiesInterceptor } from './interceptors/auth-cookies.interceptor'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<void> {
    await this.authService.register(body)
  }

  @Post('login')
  @UseInterceptors(AuthCookiesInterceptor)
  async login(@Body() body: LoginDto): Promise<LoginResultDto> {
    return await this.authService.login(body)
  }

  @Post('refresh')
  @UseInterceptors(AuthCookiesInterceptor)
  async refresh(@SignedCookies() cookies: RefreshDto): Promise<LoginResultDto> {
    return await this.authService.refresh(cookies)
  }

  @Post('logout')
  @UseInterceptors(AuthCookiesInterceptor)
  async logout(@SignedCookies() cookies: LogoutDto): Promise<void> {
    await this.authService.logout(cookies)
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: ApiRequest): UserDto {
    return req.user!
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMe(@Req() { user }: ApiRequest, @Body() body: PatchMeDto): Promise<void> {
    await this.authService.patchUser(user!.id, body)
  }
}
