import { Column, Entity } from 'typeorm'

import { composeTransformers } from '../transformers/compose'
import { LowercaseTransformer } from '../transformers/lowercase.transformer'
import { TrimTransformer } from '../transformers/trim.transformer'
import { BaseEntity } from './base.entity'

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
}
