import React, { FC, useState } from 'react'
import classNames from 'classnames'

import NumericInput from '@frakt/components/NumericInput'

import styles from './Field.module.scss'

export interface FieldProps {
  value: string
  onValueChange: (nextValue: string) => void
  modalTitle?: string
  label?: string
  style?: React.CSSProperties
  className?: string
  onUseMaxButtonClick?: () => void
  error?: boolean
  placeholder?: string
  amountMaxLength?: number
  disabled?: boolean
  lpBalance?: number
  integerOnly?: boolean
}

const Field: FC<FieldProps> = ({
  value,
  onValueChange,
  label,
  style,
  className,
  error,
  amountMaxLength,
  placeholder = '0.0',
  disabled = false,
  lpBalance,
  integerOnly,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const onUseMaxButtonClick = () => {
    lpBalance && onValueChange(String(lpBalance))
  }

  return (
    <div
      style={style}
      className={classNames([
        { [styles.focused]: isFocused },
        { [styles.error]: error },
      ])}
    >
      <div className={styles.labelWrapper}>
        {!!label && (
          <div className={styles.label}>
            <span className={styles.labelName}>{label}</span>
          </div>
        )}
      </div>

      <div
        className={classNames([styles.root, className])}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <NumericInput
          value={value}
          maxLength={amountMaxLength}
          onChange={onValueChange}
          placeholder={placeholder}
          positiveOnly
          integerOnly={integerOnly}
          className={classNames([
            styles.valueInput,
            { [styles.valueInput_disabled]: disabled },
          ])}
        />
        {!!onUseMaxButtonClick && (
          <div className={styles.useMaxBtnContainer}>
            <button
              type="button"
              className={styles.useMaxBtn}
              onClick={onUseMaxButtonClick}
            >
              Use max
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface SizeFieldFormProps
  extends Omit<FieldProps, 'value' | 'onValueChange'> {
  value?: {
    amount: string
  }
  onChange?: any
  maxLength?: number
}

export const TokenFieldForm: FC<SizeFieldFormProps> = ({
  onChange,
  value,
  ...props
}) => {
  const onAmountChange = (amount: string) => onChange?.({ ...value, amount })

  return (
    <Field {...props} value={value?.amount} onValueChange={onAmountChange} />
  )
}

export default Field
