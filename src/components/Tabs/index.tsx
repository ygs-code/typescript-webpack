import { Tabs } from 'antd';
import React from 'react';

interface TabItem {
  label?: React.ReactNode;
  key?: string;
  children?: React.ReactNode;
  value?: string;
  disabled?: boolean;
}

interface Props {
  activeKey?: string;
  items?: TabItem[];
  onChange?: (key: string) => void;
}

const BoTabs: React.FC<Props> = (props) => {
  const { items = [], onChange } = props;
  return (
    <Tabs
      {...props}
      onChange={onChange}
      items={items.map((item) => {
        const { label, value, key, children } = item;

        return {
          label: label,
          key: value || key,
          children: children,
        };
      })}
    />
  );
};

export default BoTabs;
