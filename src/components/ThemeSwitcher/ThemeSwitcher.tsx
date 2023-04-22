import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';

import { selectTheme } from '../../state/theme/selectors';
import { themeActions } from '../../state/theme/actions';
import styles from './styles.module.scss';
import { Sun, Moon } from '@frakt/icons';
import classNames from 'classnames';

export const ThemeSwitcher: FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    dispatch(themeActions.setTheme(next));
  };

  const checked = theme === 'dark';

  return (
    <Switch
      width={64}
      className={classNames(styles.switch, checked && styles.checkedValue)}
      onChange={handleThemeChange}
      checked={checked}
      offColor={'#fff'}
      offHandleColor={'#fff'}
      uncheckedHandleIcon={<Sun />}
      checkedHandleIcon={<Moon />}
    />
  );
};
