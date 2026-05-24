const TOKEN_COOKIE_NAME = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const

type TokenCookieName = (typeof TOKEN_COOKIE_NAME)[keyof typeof TOKEN_COOKIE_NAME]

export interface TokenConfig {
  cookieName: TokenCookieName
  expirationMin: number
}

export const TOKEN_CONFIG = {
  ACCESS_TOKEN: {
    cookieName: TOKEN_COOKIE_NAME.ACCESS_TOKEN,
    expirationMin: 5,
  },
  REFRESH_TOKEN: {
    cookieName: TOKEN_COOKIE_NAME.REFRESH_TOKEN,
    expirationMin: 10,
  },
} as const satisfies Record<string, TokenConfig>
