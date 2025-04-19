import './index.scss';
import React, { memo, Component, JSX } from 'react';
import { mapRedux } from '@/redux';
import setBreadcrumbAndTitle from 'src/components/setBreadcrumbAndTitle';
import { tablePage } from 'src/components/TablePage';
import { Button, Table, TableProps, Tag } from 'antd';
import { getCustomerOrderDealReportList, getCustomerTradingAccountList } from '@/apis/page/LowerLevelCustomers/tradingOrder';
import TopTitle from 'src/components/TopTitle';
import { withTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import DetailsSlot from './DetailsSlot';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

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

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  description: string;
  tags: string[];
}
// const clientTypeMap: { [key in 100 | 200]: string } = {
//   100: '交易者',
//   200: '合作方',
// }
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

// @(tablePage<React.ComponentType>)
@tablePage
class TradingOrderPage extends Component<
  CustomerManagementProps,
  {
    accountInfoData: AccountInfoData[];
    selectOptions: { value: string; label: string; serverID: string }[];
  }
> {
  language: string;
  selectOptions: { value: string; label: string; serverID: string }[];
  renderSearch: any;
  renderTable: any;
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
    const { getFieldsValue = () => { } } = this.searchForm || {}
    const { orderStatus } = getFieldsValue(['orderStatus']) || '0' // 订单类型

    return [
      {
        title: t('Pages.LowerLevelCustomers.TradingVarieties'), // 交易品种
        dataIndex: 'symbol',
        key: 'symbol',
        //列前面加图标
        render: (text) => (
          <>
            {true ? (
              <img
                src="static/images/icon_gold.svg"
                style={{ marginRight: 8 }}
                alt=""
              />
            ) : (
              <img
                src="static/images/icon_silver.svg"
                style={{ marginRight: 8 }}
                alt=""
              />
            )}
            {text}
          </>
        ),
      },
      {
        title: t('Pages.LowerLevelCustomers.Type'), // 类型
        key: 'type',
        dataIndex: 'type',
        render: (type: number) => {
          const typeList = [
            'Buy',
            'Sell',
            'Buy Limit',
            'Sell Limit',
            'Buy Stop',
            'Sell Stop',
            'Buy Stop Limit',
            'Close By',
          ];
          const tagLabel = type !== undefined && type !== null ? typeList[type] : ''
          const tagStyle = type === undefined ? {} : type % 2 === 0
            ? {
              backgroundColor: '#E7F3FF',
              color: '#1781E4',
              border: '1px solid #E7F3FF',
              borderRadius: '12px',
            }
            : {
              backgroundColor: '#FFF2F3',
              color: '#E4172B',
              border: '1px solid #FFF2F3',
              borderRadius: '12px',
            }
          return (
            <span>
              <Tag style={tagStyle}>{tagLabel}</Tag>
            </span>
          );
        },
      },
      {
        title: t('Pages.LowerLevelCustomers.OpeningTime'), // 开仓时间(系统时间)
        dataIndex: '开仓时间(系统时间)',
        key: '开仓价(系统时间)',
        // render: (text) => (<span>
        //   {language === 'zh' || language === 'hk'
        //     ? dayjs(text).format('YYYY-MM-DD hh:mm:ss')
        //     : dayjs(text).format('DD-MM-YYYY hh:mm:ss')
        //   }</span>),
      },
      {
        title: t('Pages.LowerLevelCustomers.ClosingTime'), // 平仓时间(系统时间)
        dataIndex: '平仓时间(系统时间)',
        key: '平仓时间(系统时间)',
        // render: (text) => (<span>
        //   {language === 'zh' || language === 'hk'
        //     ? dayjs(text).format('YYYY-MM-DD hh:mm:ss')
        //     : dayjs(text).format('DD-MM-YYYY hh:mm:ss')
        //   }</span>),
      },
      {
        title: t('Pages.LowerLevelCustomers.LotSize'), // 手数
        dataIndex: 'volumeExt',
        key: 'volumeExt',
        align: 'right',
        render: (text) => <span>{text ? text / 100000000 : ''}</span>,
      },
      {
        title: t('Pages.LowerLevelCustomers.OpeningPrice'), // 开仓价
        dataIndex: '开仓价',
        key: '开仓价',
        align: 'right',
      },
      {
        title: t('Pages.LowerLevelCustomers.ClosingPrice'), // 平仓价
        dataIndex: 'price',
        key: 'price',
        align: 'right',
      },
      {
        title: t('Pages.LowerLevelCustomers.ProfitAndLossUSD'), // 盈亏USD
        dataIndex: '盈亏USD',
        key: '盈亏USD',
        align: 'right',
        render: (text) => <span style={{ color: '#00C656' }}>{text}</span>,
      },
      {
        hidden: orderStatus === '1', // Deal已结订单 隐藏
        title: t('Pages.LowerLevelCustomers.RebateAmount'), // 返佣金额
        dataIndex: 'RebateAmount',
        key: 'RebateAmount',
        align: 'right',
        render: (text: number) => (<span>{text !== undefined ? '$' + String(text) : ''}</span>),
      },
      Table.EXPAND_COLUMN, //将展开按钮放到这里 最后一列 expandable
    ] as TableProps<any>['columns'];
  };

  // 表格数据源
  tableDataLoader = async (searchParams: any) => {
    const { tradingAccount, createDate, clientTypes, orderStatus, pageNumber, pageSize } = searchParams
    const { accountInfoData } = this.state
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
      data: { resultList: list = [], ...otherData },
    } = await getCustomerOrderDealReportList({ ...handleSearchParams });

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
          initialValue: '300', // 默认选中第一个
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
        label: t('Pages.LowerLevelCustomers.OrderType'), // 订单类型
        name: 'orderStatus',
        type: 'radioGroup',
        itemProps: {
          initialValue: '1',
        },
        props: {
          options: [
            //0全部 1已结 2未结
            { label: t('Pages.LowerLevelCustomers.ClosedOrders'), value: '1' }, //已结订单
            { label: t('Pages.LowerLevelCustomers.OpenOrders'), value: '2' }, //未结订单
          ],
          block: true,
          // className: "order-filter-radio",
          optionType: 'button',
          buttonStyle: 'solid',
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
        <TopTitle title={this.props.t('Pages.LowerLevelCustomers.TradingOrder')} />
        <div className="trading-order-list-table">
          {this.renderSearch({})}
          {this.renderTable({
            rowKey: 'key',  //设置主键 key 是deal或者order
            scroll: {
              // x: 1300, //设置宽度
            },
            tableProps: {
              expandable: {
                expandedRowRender: (record: DataType) => <p style={{ margin: 0 }}><DetailsSlot record={record} /></p>, //插槽在这里
                expandIcon: ({ expanded, onExpand, record }: { expanded: boolean; onExpand: (record: any, e: React.MouseEvent<HTMLElement>) => void; record: DataType }) =>
                (<Button
                  type="text"
                  onClick={(e) => onExpand(record, e)}
                  icon={expanded ? <UpOutlined /> : <DownOutlined />}
                />)
              }
            },
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
            label: t('Pages.LowerLevelCustomers.TradingOrder'),
          },
        ],
        title: t('Pages.LowerLevelCustomers.TradingOrder'),
      };
    })(memo(TradingOrderPage))
  )
);
