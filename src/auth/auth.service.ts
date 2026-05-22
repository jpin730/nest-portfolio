import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ApiConfigService } from '@api-config/api-config.service'
import { UserEntity } from '@database/entities/user.entity'

import { hash } from 'bcrypt'
import { RegisterDto } from './dtos/register.dto'

@Injectable()
export class AuthService {
  private isRegistrationEnable = false

  constructor(
    private readonly apiConfigService: ApiConfigService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register({ email, password }: RegisterDto): Promise<void> {
    if (!this.isRegistrationEnable) {
      throw new NotFoundException()
    }

    const saltRounds = this.apiConfigService.authSaltRounds
    const hashedPassword = await hash(password, saltRounds)
    const user = this.userRepository.create({ email, password: hashedPassword })
    await this.userRepository.save(user)
    this.isRegistrationEnable = false
  }
}
