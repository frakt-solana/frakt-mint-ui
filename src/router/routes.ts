import { FC } from 'react'

import PresaleMintPage from '@frakt/pages/PresaleMintPage/PresaleMintPage'
import RootPage from '@frakt/pages/RootPage'
import Page404 from '@frakt/pages/Page404'

import { PATHS } from './paths'

interface Route {
  path: string
  component: FC
}

export const routes: ReadonlyArray<Route> = [
  {
    path: PATHS.ROOT,
    component: RootPage,
  },
  {
    path: PATHS.PRESALE,
    component: PresaleMintPage,
  },
  {
    path: '*',
    component: Page404,
  },
]
