import './index.scss';
import { memo, Component } from 'react';
import { mapRedux } from '@/redux';
import setBreadcrumbAndTitle from 'src/components/setBreadcrumbAndTitle';
import { tablePage } from 'src/components/TablePage';
import { TableProps, Tag } from 'antd';
import { getDepositWithdrawalReport } from '@/apis/page/depositAndWithdrawalReport'
import TopTitle from 'src/components/TopTitle';
import { withTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface CustomerManagementProps {
  pushRoute?: (path: string | Object) => void;
  routePaths?: {
    customerDetails: string;
  };
  t: (key: string) => string; // Add translation function
  state: {
    user: {
      userInfo: any;
    };
  };
}

@tablePage
class DepositAndWithdrawalReport extends Component<
  CustomerManagementProps,
  {
    accountInfoData: any;
    selectOptions: { value: string; label: string; serverID: string }[];
  }
> {
  language: string;
  selectOptions: { value: string; label: string; serverID: string }[];
  renderSearch: any
  renderTable: any

  constructor(props: any) {
    super(props);
    this.language = props.state.common.language;
  }

  componentDidMount() { }

  handleTimeMsc = (timeMsc: number) => {
    const time = new Date(timeMsc);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };//处理日期
  formatDate(isoString: string) {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat(this.language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    return formatter.format(date)
      .replace(/\//g, '-')
      .replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-$3');
  }
  // 定义表格列
  getColumns = () => {
    const { t } = this.props
    return [
      {
        title: t('Pages.DepositAndWithdrawalReport.Date'), // 日期
        dataIndex: 'created',
        key: 'created',
        render: (text) => (<span>
          {this.language === 'zh' || this.language === 'hk'
            ? dayjs(text).format('YYYY-MM-DD hh:mm:ss')
            : dayjs(text).format('DD-MM-YYYY hh:mm:ss')
          }</span>),
      },
      {
        title: t('Pages.DepositAndWithdrawalReport.Type'), // 类型
        key: 'cfType',
        dataIndex: 'cfType',
        render: (key: number) => {
          const handleCfType = (str: string | number) => {
            const arr = [
              { key: '100', color: 'error', value: t('Pages.DepositAndWithdrawalReport.Deposit') }, //入金
              { key: '200', color: 'processing', value: t('Pages.DepositAndWithdrawalReport.Withdrawal') },//出金
              { key: '300', color: 'processing', value: t('Pages.DepositAndWithdrawalReport.DeductionPhysical') }, //实货扣款
            ]
            return arr.find(item => item.key === String(str)) || { key: '', color: '', value: '' }
          }
          const { color, value } = handleCfType(key)

          const tagProps = {
            bordered: false,
            color,
            style: { borderRadius: '12px' }
          }
          return (
            <span>
              <Tag {...tagProps}>{value}</Tag>
            </span>
          );
        },
      },
      {
        title: t('Pages.DepositAndWithdrawalReport.TradingWallet'),   // 交易钱包
        dataIndex: 'accountOrAddress',
        key: 'accountOrAddress',
        render: (text) => {
          if (text === null) return '--';
          function handleTradingWallet(str: string | number) {
            const stri = String(str)
            if (stri.length < 8) return stri;
            const start = stri.substring(0, 4)
            const end = stri.slice(-4)
            const middle = '*'.repeat(stri.length - 8); // 中间部分替换为星号
            return start + middle + end
          }
          return (<span>{handleTradingWallet(text)}</span>)  //处理格式
        }
      },
      {
        title: t('Pages.DepositAndWithdrawalReport.AmountUSD'), // 金额USD
        dataIndex: 'baseAmount',
        key: 'baseAmount',
      },
      {
        title: t('Pages.DepositAndWithdrawalReport.ApprovalStatus'), // 审批状态
        dataIndex: 'boApprovalStatus',
        key: 'boApprovalStatus',
        render: (text) => {
          function handleBoStatusColor(str: string | number) {
            const arr = [
              { key: '000', value: '#D4A767' }, //审批中
              { key: '100', value: '#49505E' }, //待审批
              { key: '200', value: '#49505E' },//审批通过
              { key: '300', value: '#49505E' }, //审批拒绝 
            ]
            return arr.find(item => item.key === String(str))?.value || String(str) || ''
          }
          function handleBoStatus(str: string | number) {
            const arr = [
              { key: '100', value: t('Pages.DepositAndWithdrawalReport.PendingApproval') }, //待审批
              { key: '200', value: t('Pages.DepositAndWithdrawalReport.ApprovalPassed') },//审批通过
              { key: '300', value: t('Pages.DepositAndWithdrawalReport.ApprovalRejected') }, //审批拒绝
            ]
            return arr.find(item => item.key === String(str))?.value || str || ''
          }
          return (<span style={{ color: handleBoStatusColor(text) }}>{handleBoStatus(text)}</span>)
        }
      },
      {
        title: t('Pages.DepositAndWithdrawalReport.Comment'), // 备注 
        dataIndex: 'remark',
        key: 'remark',
      },
    ] as TableProps<any>['columns'];
  };

  // 表格数据源
  tableDataLoader = async (searchParams: any) => {
    const {
      state: {
        user: { userInfo: { relatedTradingAccounts = [] } = {} } = {},
      } = {},
    } = this.props;

    const { tradingAccount, createDate, orderStatus, pageNumber, pageSize } = searchParams
    // 日期
    const [startTime, endTime] = createDate || ['', ''];
    // 账户类型
    const serverID = relatedTradingAccounts.find((item: { tradingAccount: string; serverID: string }) => item.tradingAccount === tradingAccount)?.serverID || ''

    const handleSearchParams = {
      startTime: startTime === '' ? '' : dayjs(startTime).format('YYYY-MM-DD'),
      endTime: endTime === '' ? '' : dayjs(endTime).format('YYYY-MM-DD'),
      tradingAccount,
      orderStatus,
      serverID,
      pageNumber,
      pageSize,
      // ...searchParams,
    };

    const {
      data: { resultList: list, ...otherData },
    } = await getDepositWithdrawalReport({ ...handleSearchParams });

    return {
      ...otherData,
      list,
    };
  };

  // 表格搜索字段
  getSearchFields() {
    const {
      t,
      state: {
        user: { userInfo: { relatedTradingAccounts = [] } = {} } = {},
      } = {},
    } = this.props
    // 默认选中第一个账户
    const tradingAccountValue = relatedTradingAccounts.length > 0 ? (relatedTradingAccounts[0]?.tradingAccount || '') : ''

    return [
      {
        label: t('Pages.DepositAndWithdrawalReport.TradingAccount'), // 账户
        name: 'tradingAccount',
        type: 'select',
        itemProps: {
          initialValue: tradingAccountValue, // 默认选中第一个
        },
        props: {
          allowClear: false,
          valueKey: 'tradingAccount',
          labelKey: 'tradingAccount',
          options: relatedTradingAccounts,
        },
      },
      {
        label: t('Pages.DepositAndWithdrawalReport.OrderType'), // 订单类型
        name: 'orderStatus',
        type: 'radioGroup',
        itemProps: {
          initialValue: '1', // 默认选中第一个
        },
        props: {
          options: [
            //0全部 1已结 2未结
            { label: t('Pages.DepositAndWithdrawalReport.ClosedOrders'), value: '1' }, //已结订单
            { label: t('Pages.DepositAndWithdrawalReport.OpenOrders'), value: '2' }, //未结订单
          ],
          block: true,
          // className: "order-filter-radio",
          optionType: 'button',
          buttonStyle: 'solid',
        },
      },
      {
        label: t('Pages.DepositAndWithdrawalReport.CreateDate'), // 创建时间
        name: 'createDate',
        type: 'rangePicker',
        props: {
          placeholder: [
            t('Components.DatePicker.StartDate'),
            t('Components.DatePicker.EndDate'),
          ], // 日期选择框的默认显示文本
          format: this.language === 'zh' || this.language === 'hk' ? 'YYYY-MM-DD' : 'MM-DD-YYYY', // 日期格式
        },
      },
    ];
  }

  getTableProps = () => {
    return {};
  };

  render() {
    return (
      <>
        <TopTitle title={this.props.t('Pages.DepositAndWithdrawalReport.DepositAndWithdrawalReport')} />
        <div className="deposit-withdrawal-list-table">
          {this.renderSearch({})}
          {this.renderTable({
            rowKey: 'reference',  //设置主键
            scroll: {
              // x: 1300, //设置宽度
            },
            tableProps: {},
            paginationProps: {},
          })}
        </div>
      </>
    );
  }
}

export default withTranslation()(
  mapRedux()(
    setBreadcrumbAndTitle((props: { t: (key: string) => string }) => {
      const { t } = props;
      // 设置面包屑和标题
      return {
        breadcrumb: [
          {
            label: t('Pages.DepositAndWithdrawalReport.DepositAndWithdrawalReport'),
          },
        ],
        title: t('Pages.DepositAndWithdrawalReport.DepositAndWithdrawalReport'),
      };
    })(memo(DepositAndWithdrawalReport))
  )
);
