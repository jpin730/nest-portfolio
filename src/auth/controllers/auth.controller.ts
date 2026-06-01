import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common'

import type { ApiRequest } from '@common/interfaces/api-request.interface'

import { Public } from '../decorators/public.decorator'
import { LoginResultDto } from '../dtos/login-result.dto'
import { LoginDto } from '../dtos/login.dto'
import { PatchMeDto } from '../dtos/patch-me.dto'
import { RegisterDto } from '../dtos/register.dto'
import { UserDto } from '../dtos/user.dto'
import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResultDto> {
    return await this.authService.login(body)
  }

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<void> {
    await this.authService.register(body)
  }

  @Post('refresh')
  async refresh(@Req() { authSession }: ApiRequest): Promise<LoginResultDto> {
    return await this.authService.refresh(authSession!)
  }

  @Post('logout')
  async logout(@Req() { authSession }: ApiRequest): Promise<void> {
    await this.authService.logout(authSession!)
  }

  @Get('me')
  getMe(@Req() { authSession }: ApiRequest): UserDto {
    return authSession!.user
  }

  @Patch('me')
  async updateMe(@Req() { authSession }: ApiRequest, @Body() body: PatchMeDto): Promise<void> {
    await this.authService.patchUser(authSession!.user.id, body)
  }
}
