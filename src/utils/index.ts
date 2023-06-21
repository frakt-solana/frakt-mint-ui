import { Notify } from './solanaUtils/solanaUtils.model'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { notification } from 'antd'
import { NotifyType } from './solanaUtils'

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

export const notify: Notify = ({
  message = '',
  description = null,
  type = NotifyType.INFO,
  persist = false,
  key = '',
}) => {
  notification[type]({
    className: `fraktion__notification_${[type]}`,
    message,
    description,
    placement: 'bottomRight',
    duration: persist ? 0 : 4.5,
    key,
  })
}
