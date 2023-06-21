import { HeaderCell } from './HeaderCell'

export const createHeaderCell = <T extends Record<string, any>>(
  label: string,
  fixedLeft?: boolean,
) => <HeaderCell label={label} fixedLeft={fixedLeft} />
