import { FC } from 'react';

import RootPage from '@frakt/pages/RootPage';
import Page404 from '@frakt/pages/Page404';

import { PATHS } from './paths';

interface Route {
  path: string;
  component: FC;
}

export const routes: ReadonlyArray<Route> = [
  {
    path: PATHS.ROOT,
    component: RootPage,
  },
  {
    path: '*',
    component: Page404,
  },
];
