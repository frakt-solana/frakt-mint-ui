import { Link } from 'react-router-dom';

import styles from './styles.module.scss';
import { FC } from 'react';
import classNames from 'classnames';

interface IButtonRegularProps {
  className?: string;
  disabled?: boolean;
  isLink?: boolean;
  linkAttrs?: any;
  onClick?: (args: any) => any;
  children: any;
  type?: 'primary' | 'secondary' | 'tertiary';
}

const Button: FC<IButtonRegularProps> = ({
  className,
  disabled = false,
  isLink = false,
  linkAttrs,
  onClick = () => {},
  type = 'primary',
  children,
}) => {
  if (isLink) {
    return (
      <Link
        className={classNames([
          styles.root,
          styles.link,
          className,
          styles[type],
        ])}
        {...linkAttrs}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      type="button"
      className={classNames([styles.root, styles[type], className])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
