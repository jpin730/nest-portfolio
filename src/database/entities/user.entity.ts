import { Column, Entity } from 'typeorm'

import { composeTransformers } from '../transformers/compose'
import { LowercaseTransformer } from '../transformers/lowercase.transformer'
import { TrimTransformer } from '../transformers/trim.transformer'
import { BaseEntity } from './base.entity'

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({
    type: 'text',
    unique: true,
    transformer: composeTransformers(TrimTransformer, LowercaseTransformer),
  })
  email: string

  @Column({ type: 'text' })
  password: string
}
