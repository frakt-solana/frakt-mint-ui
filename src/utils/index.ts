export const throwLogsError = (msg: any) => {
  console.error(msg)
  // eslint-disable-next-line no-console
  console.warn(msg?.logs?.join('\n'))
}
