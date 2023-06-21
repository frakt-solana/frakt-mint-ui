import { ChangeEvent, FC } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { Input } from 'antd';

import styles from '@frakt/components/SearchInput/styles.module.scss';

interface SearchProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeHolderText?: string;
  className?: string;
}

export const Search: FC<SearchProps> = ({
  onChange,
  placeHolderText = 'Search by name',
  className = '',
}) => {
  return (
    <Input
      className={classNames(styles.input, className)}
      placeholder={placeHolderText}
      prefix={<SearchOutlined className={styles.search} />}
      onChange={onChange}
    />
  );
};
