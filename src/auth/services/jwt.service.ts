import { Injectable } from '@nestjs/common'
import { decodeJwt, importPKCS8, importSPKI, JWTPayload, jwtVerify, SignJWT } from 'jose'

import { ConfigService } from '@config/services/config.service'

import { decodeB64ToPem } from '../utils/decode-b64-to-pem'

@Injectable()
export class JwtService {
  private readonly algorithm = 'EdDSA'
  private privateKey: CryptoKey
  private publicKey: CryptoKey

  constructor(private readonly configService: ConfigService) {
    void this.init()
  }

  private async init(): Promise<void> {
    const privateKeyPem = decodeB64ToPem(this.configService.authJwtPrivateKey)
    const publicKeyPem = decodeB64ToPem(this.configService.authJwtPublicKey)
    this.privateKey = await importPKCS8(privateKeyPem, this.algorithm)
    this.publicKey = await importSPKI(publicKeyPem, this.algorithm)
  }

  sign(sub: string, expirationTime: string): Promise<string> {
    const alg = this.algorithm
    return new SignJWT()
      .setProtectedHeader({ alg })
      .setExpirationTime(expirationTime)
      .setSubject(sub)
      .sign(this.privateKey)
  }

  decode(token: string): JWTPayload {
    return decodeJwt(token)
  }

  async verifyAsync(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, this.publicKey)
    return payload
  }
}
