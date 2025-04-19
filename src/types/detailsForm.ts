import { Rule } from 'antd/lib/form';
import { Form } from 'antd';
import type { UploadFile } from 'antd';

export interface DetailsFormProps {
  pushRoute: (path: string) => void;
  routePaths: string[];
  match: {
    params: {
      action?: string;
      id?: string;
    };
  };
  state?: {
    user?: {
      userInfo?: any;
    };
  };
  formItemPropData: [FormItemProps | FormItemProps[], SlotComponentProps][];
  formProps?: React.ComponentProps<typeof Form>;
  checkPayWayIndex?: number;
  formDisabled: boolean;
  formReadOnly?: boolean; // Added formReadOnly property
  formLoading?: boolean;
}

export interface FormItemProps {
  name: string;
  label?: string;
  rules?: Rule[];
  hidden?: boolean;
  initialValue?: string;
  getValueFromEvent?: (value: string, option: { label: string; value: string; }) => { label: string; value: string; };
}

export interface SlotComponentProps {
  type: string;
  props?: any;
  boxStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  datas?: Array<{ id: number; imgUrl: string; style: React.CSSProperties }>;
  options?: Array<{
    props?: {
      value?: string;
      type?: "" | "primary" | "dashed" | "link" | "text";
      htmlType?: "button" | "submit" | "reset";
      style?: React.CSSProperties;
      placeholder?: string;
      options?: Array<{
        label: string;
        value: string;
        serverID?: string;
      }>;
      showSearch?: boolean;
      listType?: "text" | "picture" | "picture-card";
      fileList?: UploadFile[]
      onChange?: (e: HTMLButtonElement) => void
      onClick?: (e: HTMLButtonElement) => void
    };
    datas?: {
      imgUrl?: string;
      content?: string;
    }
    content?: string;
  }>;
  content?: string;
  showSpan?: boolean;
  spanContent?: string;
  onClick?: (data: { id: number; imgUrl: string; style: React.CSSProperties }) => void;
}