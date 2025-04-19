import React, { memo, useCallback } from 'react';

import { Checkbox, Icon, Input, Radio, message } from 'antd';

import FormInput from '../FormInput';

import './styles.scss';

export default memo((props) => {
  let {
    addonAfter = null,
    value,
    onChange = () => {},
    readOnly,
    prefix = '',
    suffix = '',
    placeholder = '',
    decimalLength,
    type,
    min,
    max = Infinity,
    className,
    addonBefore = '',
    disabled,
    style = {},
    showCounter,
    maxLength,
    onBlur = () => {},
  } = props;

  // min={1}
  // max={30}
  const $onChange = useCallback(
    ($value = '') => {
      min = min ? new Number(min) : min;
      max = max ? new Number(max) : max;

      if (type == 'number') {
        decimalLength = decimalLength || decimalLength === 0 ? decimalLength : 0;
      }
      if (decimalLength !== undefined) {
        const reg =
          decimalLength === 0
            ? /(^([0]{1})$)|(^([1-9]{1})([0-9]*)$)/gi
            : new RegExp(`(^[0-9]{1,}$)|(^[0-9]{1,}[\\.]{1}[0-9]{1,${decimalLength}}$)|(^[0-9]{1,}[\\.]{1}$)`, 'ig');
        if ($value) {
          let flag = reg.test($value);
          // $value = new Number($value)
          if (flag) {
            if (min !== undefined && max !== undefined && $value >= min && $value <= max) {
              onChange($value);
            } else if (min !== undefined && max === undefined && $value >= min) {
              onChange($value);
            } else if (min === undefined && max !== undefined && $value <= max) {
              onChange($value);
            } else if (min === undefined && max === undefined) {
              onChange($value);
            }
          }
        } else {
          onChange($value);
        }
        return;
      }
      onChange($value);
    },
    [value, decimalLength]
  );

  return (
    <div style={style} className={`percentage-input  ${className ? className : ''}`}>
      <FormInput
        showCounter={showCounter}
        maxLength={maxLength}
        value={value}
        prefix={prefix}
        suffix={suffix}
        placeholder={placeholder}
        addonBefore={addonBefore}
        onChange={(event) => {
          const { target: { value } = {} } = event;
          $onChange(value);
        }}
        disabled={readOnly || disabled}
        // addonAfter={<Icon type="percentage" />}
        addonAfter={addonAfter}
        onBlur={onBlur}
      />
    </div>
  );
});
