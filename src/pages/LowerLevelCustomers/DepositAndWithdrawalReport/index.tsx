import './index.scss';
import { memo, Component } from 'react';
import { mapRedux } from '@/redux';
import setBreadcrumbAndTitle from 'src/components/setBreadcrumbAndTitle';
import { tablePage } from 'src/components/TablePage';
import { TableProps, Tag } from 'antd';
import { getCustomerDepositWithdrawalReportList } from '@/apis/page/LowerLevelCustomers/depositAndWithdrawalReport'
import { getCustomerTradingAccountList } from '@/apis/page/LowerLevelCustomers/tradingOrder';
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
    common: {
      language: string;
    };
  };
}

type AccountInfoData = {
  tradingAccount?: string;
  serverID?: string;
  ib?: string;
  familyName: string;
  givenName: string;
  firstName: string;
  lastName: string;
  labelKey?: string;
  valueKey?: string;
}

@tablePage
class DepositAndWithdrawalReport extends Component<
  CustomerManagementProps,
  {
    accountInfoData: AccountInfoData[];
    selectOptions: { value: string; label: string; serverID: string }[];
  }
> {
  language: string;
  selectOptions: { value: string; label: string; serverID: string }[];
  renderSearch: any
  renderTable: any
  searchForm: {
    getFieldsValue?: (value: string[]) => any;
    setFieldsValue?: (values: any) => void;
  } | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      accountInfoData: [], // 账户信息数据
    }
  }

  async componentDidMount() {
    try {
      const { data = [] } = await getCustomerTradingAccountList('300')
      const accountInfoData = data.map((item: AccountInfoData) => (
        {
          ...item,
          cLabelKey: item.ib + ' ' + item.familyName + item.givenName,
          eLabelKey: item.ib + ' ' + item.firstName + ' ' + item.lastName,
          valueKey: item.ib
        }
      ))
      this.setState({ ...this.state, accountInfoData })
    }
    catch (error) { }
  }
  // 定义表格列
  getColumns = () => {
    const { t } = this.props
    const language = this.props.state.common.language
    return [
      {
        title: t('Pages.LowerLevelCustomers.Date'), // 日期
        dataIndex: 'created',
        key: 'created',
        render: (text) => (<span>
          {language === 'zh' || language === 'hk'
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
        title: t('Pages.LowerLevelCustomers.TradingWallet'),   // 交易钱包
        dataIndex: 'accountOrAddress',
        key: 'accountOrAddress',
        render: (text) => {
          if (text === null) return '--';
          function handleTradingWallet(str: string | number) {
            const stri = String(str)
            if (stri.length < 8) return stri;
            const start = stri.substring(0, 4)
            const end = stri.slice(-4)
            const middle = '*'.repeat(stri.length - 8) // 中间部分替换为星号
            return start + middle + end
          }
          return (<span>{handleTradingWallet(text)}</span>)  //处理格式
        }
      },
      {
        title: t('Pages.LowerLevelCustomers.AmountUSD'), // 金额USD
        dataIndex: 'baseAmount',
        key: 'baseAmount',
        // align: 'right',
      },
      {
        title: t('Pages.LowerLevelCustomers.ApprovalStatus'), // 审批状态
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          function handleStatesColor(str: string | number) {
            const arr = [
              { key: '100', value: '#49505E' }, //申请中
              { key: '200', value: '#D4A767' }, //审批中
              { key: '300', value: '#49505E' },//已完成
              { key: '400', value: '#FF4D4F' }, //交易失败 
            ]
            return arr.find(item => item.key === String(str))?.value || String(str) || ''
          }

          function handleStates(str: string | number) {
            const arr = [
              { key: '100', value: t('Pages.LowerLevelCustomers.Requesting') }, //请求中
              { key: '200', value: t('Pages.LowerLevelCustomers.Processing') },//处理中
              { key: '300', value: t('Pages.LowerLevelCustomers.Finish') }, //完成
              { key: '400', value: t('Pages.LowerLevelCustomers.TransactionFailed') }, //交易失败
            ]
            return arr.find(item => item.key === String(str))?.value || str || ''
          }
          return (<span style={{ color: handleStatesColor(text) }}>{handleStates(text)}</span>)
        }
      },
      {
        title: t('Pages.LowerLevelCustomers.Comment'), // 备注 
        dataIndex: 'remark',
        key: 'remark',
      },
    ] as TableProps<any>['columns'];
  };

  // 表格数据源
  tableDataLoader = async (searchParams: any) => {
    const { accountInfoData } = this.state

    const { tradingAccount, createDate, clientTypes, orderStatus, pageNumber, pageSize } = searchParams
    // 日期
    const [startTime, endTime] = createDate || ['', '']
    // 账户数据 300合作方取 ib 200交易者取 tradingAccount serverID
    const accData = clientTypes === '300'
      ? { ib: tradingAccount }
      : {
        tradingAccount,
        serverID: accountInfoData.find((item: AccountInfoData) => item.tradingAccount === tradingAccount)?.serverID || undefined
      }

    const handleSearchParams = {
      // ...searchParams,
      startTime: startTime === '' ? '' : dayjs(startTime).format('YYYY-MM-DD'),
      endTime: endTime === '' ? '' : dayjs(endTime).format('YYYY-MM-DD'),
      clientTypes,
      orderStatus,
      pageNumber,
      pageSize,
      ...accData
    };

    const {
      data: { resultList: list, ...otherData },
    } = await getCustomerDepositWithdrawalReportList({ ...handleSearchParams });

    return {
      ...otherData,
      list,
    };
  };

  // 表格搜索字段
  getSearchFields() {
    const { t } = this.props
    const language = this.props.state.common.language
    const { accountInfoData } = this.state
    const { setFieldsValue = () => { } } = this.searchForm || {}

    return [
      {
        label: t('Pages.LowerLevelCustomers.CustomerType'), // 客户类型
        name: 'clientTypes',
        type: 'select',
        itemProps: {
          initialValue: '300',
          onChange: async (value: string) => {
            try {
              setFieldsValue({ tradingAccount: undefined })
              const { data = [] } = await getCustomerTradingAccountList(value)
              const accountInfoData = data.map((item: AccountInfoData) => (
                value === '300'
                  ? {
                    ...item,
                    cLabelKey: item.ib + ' ' + item.familyName + item.givenName,
                    eLabelKey: item.ib + ' ' + item.firstName + ' ' + item.lastName,
                    valueKey: item.ib
                  }
                  : {
                    ...item,
                    cLabelKey: item.tradingAccount + ' ' + item.familyName + item.givenName,
                    eLabelKey: item.tradingAccount + ' ' + item.firstName + ' ' + item.lastName,
                    valueKey: item.tradingAccount
                  }
              ))
              this.setState({ ...this.state, accountInfoData })
            }
            catch (error) {}
          }
        },
        props: {
          allowClear: false,
          options: [
            { label: t('Pages.LowerLevelCustomers.Partners'), value: '300' }, // 合作方
            { label: t('Pages.LowerLevelCustomers.Trader'), value: '200' }, // 交易员
          ],
        },
      },
      {
        label: t('Pages.LowerLevelCustomers.TradingAccount'), // 账户
        name: 'tradingAccount',
        type: 'select',
        props: {
          placeholder: t('Pages.LowerLevelCustomers.FilterAccounts'), // 筛选账户
          labelKey: language === 'zh' || language === 'hk' ? 'cLabelKey' : 'eLabelKey',
          valueKey: 'valueKey',
          options: accountInfoData,
        },
      },
      {
        label: t('Pages.LowerLevelCustomers.State'), // 状态
        name: 'orderStatus',
        type: 'select',
        itemProps: {
          initialValue: '',
        },
        props: {
          allowClear: false,
          options: [
            { label: t('Pages.LowerLevelCustomers.All'), value: '' }, // 全部
            { label: t('Pages.LowerLevelCustomers.Requesting'), value: '100' }, // 请求中
            { label: t('Pages.LowerLevelCustomers.Processing'), value: '200' }, // 处理中
            { label: t('Pages.LowerLevelCustomers.Finish'), value: '300' }, // 完成
            { label: t('Pages.LowerLevelCustomers.TransactionFailed'), value: '400' }, // 交易失败
          ],
        },
      },
      {
        label: t('Pages.LowerLevelCustomers.CreateDate'), // 创建时间
        name: 'createDate',
        type: 'rangePicker',
        props: {
          placeholder: [
            t('Components.DatePicker.StartDate'),
            t('Components.DatePicker.EndDate'),
          ], // 日期选择框的默认显示文本
          format: language === 'zh' || language === 'hk' ? 'YYYY-MM-DD' : 'MM-DD-YYYY',
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
