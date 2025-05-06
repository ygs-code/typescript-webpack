import React from 'react';
type Dates = {
  startDate: Date;
  endDate: Date;
};

// type DefaultValue = {
//   startDate: Date;
//   endDate?: Date;
// };


type DefaultValue = [
  Date,
  Date
]
 

type FooterParams = Dates & { close: Function; today: Function };

export interface Props {
  value?:DefaultValue,
  defaultValue?: DefaultValue;
  showTime?: boolean;
  onDateSelected?: Function;
  onClose?: Function;
  closeOnSelect?: boolean;
  disableRange?: boolean;
  placeholder?: (Dates) => React.Component;
  placeholderText?: string;
  dateFormat?: string;
  footer?: (FooterParams) => React.Component;
  visible?: boolean;
  onOpen?: Function;
  closeOnOutsideClick?: boolean;
  onChange?: Function;
}

export default class RangePicker extends React.Component<Props> {}
