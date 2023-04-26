import { FC } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';

interface LoaderProps {
  size?: 'large' | 'default' | 'small';
  className?: string;
}

export const Loader: FC<LoaderProps> = ({ size = 'default', className }) => {
  return (
    <svg
      style={{}}
      className={classNames([
        className,
        styles.loader,
        { [styles.small]: size === 'small' },
        { [styles.large]: size === 'large' },
      ])}
      viewBox="0 0 100 100"
    >
      <g transform="translate(0 -7.5)">
        <circle cx="50" cy="41" r="10" className={styles.loader__firstCircle}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          />
          <animate
            attributeName="r"
            dur="1s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="0;15;0"
            keySplines="0.2 0 0.8 1;0.2 0 0.8 1"
          ></animate>
        </circle>
        <circle cx="50" cy="41" r="10" className={styles.loader__secondCircle}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="180 50 50;540 50 50"
          />
          <animate
            attributeName="r"
            dur="1s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="15;0;15"
            keySplines="0.2 0 0.8 1;0.2 0 0.8 1"
          ></animate>
        </circle>
      </g>
    </svg>
  );
};

export const ModalLoader: FC<LoaderProps> = ({ className }) => {
  return <div className={classNames(styles.load, className)}></div>;
};
