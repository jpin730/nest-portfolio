import { TypeOrmModule } from '@nestjs/typeorm'

export const getErrorMessage = (error: unknown): string => {
  if (
    error instanceof TypeOrmModule &&
    'detail' in error &&
    typeof error.detail === 'string' &&
    error.detail.trim() !== ''
  ) {
    return error.detail
  }
  return error instanceof Error ? error.message : JSON.stringify(error)
}
