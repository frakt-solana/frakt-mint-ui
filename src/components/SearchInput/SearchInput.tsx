import { FC } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { InputProps as InputPropsAnt } from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { Input } from '../Input';

export const SearchInput: FC<InputPropsAnt> = ({ className, ...props }) => (
  <Input
    className={classNames(styles.input, className)}
    prefix={<SearchOutlined className={styles.search} />}
    {...props}
  />
);
