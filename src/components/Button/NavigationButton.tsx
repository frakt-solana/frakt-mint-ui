import { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import Button from './Button';
import styles from './styles.module.scss';

interface NavigationButtonProps {
  path: string;
  children: ReactNode;
  type?: 'secondary' | 'primary' | 'tertiary';
  className?: string;
}

const NavigationButton: FC<NavigationButtonProps> = ({
  path,
  type = 'secondary',
  children,
  className,
}) => {
  return (
    <NavLink to={path}>
      <Button className={classNames(styles.root, className)} type={type}>
        {children}
      </Button>
    </NavLink>
  );
};

export default NavigationButton;
