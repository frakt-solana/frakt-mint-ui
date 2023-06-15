import { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Header from '@frakt/layouts/Header'

import { routes } from './routes'

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          {routes.map(({ path, component: Component }, index) => (
            <Route key={index} path={path} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
