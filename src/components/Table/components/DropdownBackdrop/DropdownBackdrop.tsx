import classNames from 'classnames';

import styles from './DropdownBackdrop.module.scss';

export const DropdownBackdrop = ({ visible, children }) => (
  <div
    className={classNames(styles.dropdown, {
      [styles.dropdownVisible]: visible,
    })}
  >
    <div className={styles.dropdownBody}>{children}</div>
  </div>
);
