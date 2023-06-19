/// <reference types="react-scripts" />

declare module '*.module.scss'
declare module '*.png'

declare module '*.wav' {
  const src: string
  export default src
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.wav' {
  const src: string
  export default src
}
