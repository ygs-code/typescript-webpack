import './index.scss';
import React, { memo, Component, JSX } from 'react';
import { mapRedux } from '@/redux';
import setBreadcrumbAndTitle from 'src/components/setBreadcrumbAndTitle';
import { tablePage } from 'src/components/TablePage';
import { Button, Table, TableProps, Tag } from 'antd';
import { getOrderDealReport } from '@/apis/page/tradingOrder';
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

// @(tablePage<React.ComponentType>)
@tablePage
class TradingOrderPage extends Component<
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
  };
  // 定义表格列
  getColumns = () => {
    const t = this.props.t;

    return [
      {
        title: t('Pages.TradingOrder.TradingVarieties'), // 交易品种
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
        title: t('Pages.TradingOrder.Type'), // 类型
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
          const tagLabel =
            type !== undefined && type !== null ? typeList[type] : '';
          const tagStyle =
            type === undefined
              ? {}
              : type % 2 === 0
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
                };
          return (
            <span>
              <Tag style={tagStyle}>{tagLabel}</Tag>
            </span>
          );
        },
      },
      {
        title: t('Pages.TradingOrder.OpeningTime'), // 开仓时间(系统时间)
        dataIndex: '开仓时间(系统时间)',
        key: '开仓价(系统时间)',
        // render: (text) => (<span>
        //   {this.language === 'zh' || this.language === 'hk'
        //     ? dayjs(text).format('YYYY-MM-DD hh:mm:ss')
        //     : dayjs(text).format('DD-MM-YYYY hh:mm:ss')
        //   }</span>),
      },
      {
        title: t('Pages.TradingOrder.ClosingTime'), // 平仓时间(系统时间)
        dataIndex: '平仓时间(系统时间)',
        key: '平仓时间(系统时间)',
        // render: (text) => (<span>
        //   {this.language === 'zh' || this.language === 'hk'
        //     ? dayjs(text).format('YYYY-MM-DD hh:mm:ss')
        //     : dayjs(text).format('DD-MM-YYYY hh:mm:ss')
        //   }</span>),
      },
      {
        title: t('Pages.TradingOrder.LotSize'), // 手数
        dataIndex: 'volumeExt',
        key: 'volumeExt',
        render: (text) => <span>{text ? text / 100000000 : ''}</span>,
      },
      {
        title: t('Pages.TradingOrder.OpeningPrice'), // 开仓价
        dataIndex: '开仓价',
        key: '开仓价',
      },
      {
        title: t('Pages.TradingOrder.ClosingPrice'), // 平仓价
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: t('Pages.TradingOrder.ProfitAndLossUSD'), // 盈亏USD
        dataIndex: '盈亏USD',
        key: '盈亏USD',
        render: (text) => <span style={{ color: '#00C656' }}>{text}</span>,
      },
      Table.EXPAND_COLUMN, //将展开按钮放到这里 最后一列
    ] as TableProps<any>['columns'];
  };

  // 表格数据源
  tableDataLoader = async (searchParams: any) => {
    const { tradingAccount, createDate, orderStatus, pageNumber, pageSize } = searchParams
    const {
      state: {
        user: { userInfo: { relatedTradingAccounts = [] } = {} } = {},
      } = {},
    } = this.props;
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
    };

    const {
      data: { resultList: list, ...otherData },
    } = await getOrderDealReport({ ...handleSearchParams });

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
        label: t('Pages.TradingOrder.TradingAccount'), // 账户
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
        label: t('Pages.TradingOrder.OrderType'), // 订单类型
        name: 'orderStatus',
        type: 'radioGroup',
        itemProps: {
          initialValue: '1', // 默认选中第一个
        },
        props: {
          options: [
            //0全部 1已结 2未结
            { label: t('Pages.TradingOrder.ClosedOrders'), value: '1' }, //已结订单
            { label: t('Pages.TradingOrder.OpenOrders'), value: '2' }, //未结订单
          ],
          block: true,
          // className: "order-filter-radio",
          optionType: 'button',
          buttonStyle: 'solid',
        },
      },
      {
        label: t('Pages.TradingOrder.CreateDate'), // 创建时间
        name: 'createDate',
        type: 'rangePicker',
        props: {
          placeholder: [
            t('Components.DatePicker.StartDate'),
            t('Components.DatePicker.EndDate'),
          ], // 日期选择框的默认显示文本
          format: this.language === 'zh' || this.language === 'hk' ? 'YYYY-MM-DD' : 'MM-DD-YYYY',
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
        <TopTitle title={this.props.t('Pages.TradingOrder.TradingOrder')} />
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
            label: t('Pages.TradingOrder.TradingOrder'),
          },
        ],
        title: t('Pages.TradingOrder.TradingOrder'),
      };
    })(memo(TradingOrderPage))
  )
);
