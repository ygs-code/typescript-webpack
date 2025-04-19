import { Rule } from 'antd/lib/form';

export interface FormItemProps {
  name: string;
  label?: string;
  rules?: Rule[];
}

export interface SlotComponentProps {
  type: string;
  props?: any;
  boxStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  datas?: Array<{ id: number; imgUrl: string; style: React.CSSProperties }>;
  options?: Array<{ props: { value: string }; content: string }>;
  content?: string;
}

export interface BanksType {
  abbr?: string
  bankCommomName?: string
  bankName?: string
  id?: string
  isEnable?: boolean
  bankBranch?: string
  bankCardNumber?: string
  deleteClick?: (item: BanksType) => void
}
export interface CurrenciesType {
  paymentChainId: string
  currency: string
  title: string
  nodeType: string
  walletAddr?: string
  delMsg?: string
  deleteClick?: (item: CurrenciesType) => void // Ensure this remains optional
}

export type CardFormValues = {
  button?: unknown;
  bankBranch: string;
  bankCardNumber: string;
  bankName: string;
}

export type WalletFormValues = {
  button?: unknown;
  paymentChainId: string;
  walletAddr: string;
}


export interface CardPackProps {
  title: string;
  showList: Array<{ id: string; imgUrl: string; name: string; num: string } & CurrenciesType & BanksType>
  cardPackLoading: boolean;
}