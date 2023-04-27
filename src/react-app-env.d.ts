/// <reference types="react-scripts" />

declare module '*.module.scss'
declare module '*.png'

declare module '*.wav' {
  const src: string
  export default src
}
