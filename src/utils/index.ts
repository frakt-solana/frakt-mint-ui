import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
export const throwLogsError = (msg: any) => {
  console.error(msg)
  // eslint-disable-next-line no-console
  console.warn(msg?.logs?.join('\n'))
}

export const encodeSignature = (signature) => {
  const buffer = Buffer.from(signature)
  const encodedSignature = bs58.encode(buffer)
  return encodedSignature
}
