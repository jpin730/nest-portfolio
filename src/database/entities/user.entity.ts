import { Column, Entity, OneToMany } from 'typeorm'

import { LowercaseTransformer } from '../transformers/lowercase.transformer'
import { TrimTransformer } from '../transformers/trim.transformer'
import { composeTransformers } from '../utils/compose-transformers.util'
import { BaseEntity } from './base.entity'
import { RefreshTokenEntity } from './refresh-token.entity'

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    transformer: composeTransformers(TrimTransformer, LowercaseTransformer),
  })
  email: string

  @Column({
    type: 'varchar',
    length: 60,
    transformer: TrimTransformer,
  })
  password: string

  @OneToMany(() => RefreshTokenEntity, (e) => e.user)
  refreshTokens: RefreshTokenEntity[]
}
