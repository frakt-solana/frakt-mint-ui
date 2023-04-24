import { FC } from 'react';

import { Input, InputProps } from '../Input';

export interface NumericInputProps extends Omit<InputProps, 'onChange'> {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  positiveOnly?: boolean;
  integerOnly?: boolean;
  className?: string;
  maxLength?: number;
  error?: boolean;
  readonly?: boolean;
  onBlur?: () => void;
}

function isNumeric(value: any): boolean {
  return !isNaN(value - parseFloat(value));
}

const NumericInput: FC<NumericInputProps> = ({
  onChange,
  value,
  onBlur,
  placeholder = '0.0',
  positiveOnly = false,
  integerOnly = false,
  className,
  error,
  maxLength,
  readonly,
  ...props
}) => {
  const onChangeHanlder = (event) => {
    const { value } = event.target;

    if (positiveOnly && value?.[0] === '-') return;
    if (integerOnly && value?.split('').includes('.')) return;
    if (maxLength && value.length > maxLength) return;

    if (value === '-' || value === '') onChange(value);
    if (isNumeric(value)) onChange(value);
  };

  return (
    <Input
      value={value}
      onBlur={onBlur}
      onChange={onChangeHanlder}
      placeholder={placeholder}
      maxLength={25}
      className={className}
      error={error}
      readOnly={readonly}
      {...props}
    />
  );
};

export default NumericInput;
