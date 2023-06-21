import { get } from 'lodash';

import { ActiveRowParams } from './types';

export const getCardOrRowClassName = (
  record: any,
  params: ActiveRowParams,
  isCard = false,
) => {
  const DEFAULT_ROW_CLASSNAME = 'rowClassName';
  const DEFAULT_ACTIVE_ROW_CLASSNAME = 'activeRowClassName';

  if (!params?.field) return !isCard ? DEFAULT_ROW_CLASSNAME : null;

  const fieldValue = get(record, params.field);

  const value = params.value;

  if (!!fieldValue && !!value && value === fieldValue) {
    if (!params?.className) return DEFAULT_ACTIVE_ROW_CLASSNAME;

    if (params?.className && !isCard) return params.className;
    if (params?.cardClassName && isCard) return params.cardClassName;
  }

  return null;
};
