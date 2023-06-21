import { FC } from 'react'

import PresaleMintPage from '@frakt/pages/PresaleMintPage/PresaleMintPage'
import PublicMintPage from '@frakt/pages/PublicMintPage/PublicMintPage'
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
  // {
  //   path: PATHS.PUBLIC,
  //   component: PublicMintPage,
  // },
  {
    path: '*',
    component: Page404,
  },
]
