import React from 'react';

import { Input } from 'antd';

 

import './index.css';

const FormInput = ({
  showCounter,
  trim,
  prefix,
  suffix,
  maxLength,
  lengthGetter,
  inputRef,
  type,
  ...props
}) => {
  const valueLength = lengthGetter
    ? lengthGetter(props.value)
    : props.value
    ? trim
      ? props.value.trim().length
      : props.value.length
    : 0;

  return (
    <div
      className={`lz-component-form-input ${
        type === 'textarea' ? ' lz-component-form-textarea' : ''
      } ${showCounter ? ' with-counter' : ''}`}
    >
      {prefix ? <span className="input-prefix">{prefix}</span> : null}

      <div className="input-wrap">
        {type === 'textarea' ? (
          <Input.TextArea className="textarea" ref={inputRef} {...props} />
        ) : type === 'number' ? (
          <Input ref={inputRef} {...props} />
        ) : (
          <Input autoComplete="off" className="input" ref={inputRef} {...props} />
        )}

        {showCounter ? (
          maxLength ? (
            <span className="input-counter" data-overflow={valueLength > maxLength}>
              {valueLength}/{maxLength}
            </span>
          ) : (
            <span className="input-counter">{valueLength}</span>
          )
        ) : null}
      </div>

      {suffix ? <span className="input-suffix">{suffix}</span> : null}
    </div>
  );
};

FormInput.defaultProps = {
  showCounter: false, // 是否显示字数统计
  lengthGetter: null,
  trim: false,
};

export default React.forwardRef((props, ref) => {
  return <FormInput {...props} inputRef={ref} />;
});
