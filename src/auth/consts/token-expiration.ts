export const TOKEN_EXPIRATION = {
  ACCESS: '5m',
  REFRESH: '30m',
} as const

export type TokenExpiration = (typeof TOKEN_EXPIRATION)[keyof typeof TOKEN_EXPIRATION]
