import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'

import type { ApiRequest } from '@common/interfaces/api-request.interface'

import { LoginResultDto } from '../dtos/login-result.dto'
import { LoginDto } from '../dtos/login.dto'
import { PatchMeDto } from '../dtos/patch-me.dto'
import { RegisterDto } from '../dtos/register.dto'
import { UserDto } from '../dtos/user.dto'
import { AuthGuard } from '../guards/auth.guard'
import { AuthService } from '../services/auth.service'

// TODO: Set AuthGuard globally
// TODO: make global decorator @IsPublic
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(AuthGuard)
  async register(@Body() body: RegisterDto): Promise<void> {
    await this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResultDto> {
    return await this.authService.login(body)
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  async refresh(@Req() { authSession }: ApiRequest): Promise<LoginResultDto> {
    return await this.authService.refresh(authSession!)
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() { authSession }: ApiRequest): Promise<void> {
    await this.authService.logout(authSession!)
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() { authSession }: ApiRequest): UserDto {
    return authSession!.user
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMe(@Req() { authSession }: ApiRequest, @Body() body: PatchMeDto): Promise<void> {
    await this.authService.patchUser(authSession!.user.id, body)
  }
}
