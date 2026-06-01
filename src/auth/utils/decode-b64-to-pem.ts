export const decodeB64ToPem = (b64String: string): string =>
  Buffer.from(b64String, 'base64').toString('utf-8')
