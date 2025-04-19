import './index.scss';
import { memo, Component, useMemo } from 'react';
import { mapRedux } from '@/redux';
import setBreadcrumbAndTitle from 'src/components/setBreadcrumbAndTitle';
import { tablePage } from 'src/components/TablePage';
import { TableProps } from 'antd';
import { getCustomerList } from '@/apis/page/LowerLevelCustomers/customerList'
import TopTitle from 'src/components/TopTitle';
import { withTranslation } from 'react-i18next';

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

type resultListType = {
  familyName: string;
  firstName: string;
  givenName: string;
  lastName: string;
  tradingAccount: string;
  rebateAmount?: number;
  ib?: string;
  reference?: string;
  upper?: string;
  children?: resultListType[];
};

@tablePage
class CustomerList extends Component<
  CustomerManagementProps, {
    selectedRowKey: string | null;
  }
> {
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
      selectedRowKey: null  //选中行
    }
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
  }

  // 定义表格列
  getColumns = () => {
    const { t } = this.props
    const { getFieldsValue = () => {} } = this.searchForm || {}
    const { clientTypes } = getFieldsValue(['clientTypes']) || '300' // 获取客户类型

    //合作方 列表
    const partnersList = [
      {
        title: t('Pages.LowerLevelCustomers.BiCode'), // BI编码
        dataIndex: 'ib',
        key: 'ib',
        width: '40%'
      },
      {
        title: t('Pages.LowerLevelCustomers.ChineseName'),   // 中文名
        dataIndex: 'chineseName',
        key: 'chineseName',
        width: '15%',
        render: (_: unknown, record: resultListType) => (<span>{record.familyName + record.givenName}</span>),  //处理格式
      },
      {
        title: t('Pages.LowerLevelCustomers.EnglishName'),   // 英文名
        dataIndex: 'englishName',
        key: 'englishName',
        width: '15%',
        render: (_: unknown, record: resultListType) => (<span>{record.firstName + ' ' + record.lastName}</span>),  //处理格式
      },
      {
        title: t('Pages.LowerLevelCustomers.MtAccount'), // MT账号
        dataIndex: 'tradingAccount',
        key: 'tradingAccount',
        width: '15%',
      },
      {
        title: t('Pages.LowerLevelCustomers.RebateAmount'), // 返佣金额
        dataIndex: 'rebateAmount',
        key: 'rebateAmount',
        width: '15%',
        render: (text: number) => (<span>{text !== undefined ? '$' + String(text) : ''}</span>),
      },
    ]
    // 交易者 列表
    const traderList = [
      {
        title: t('Pages.LowerLevelCustomers.MtAccount'), // MT账号
        dataIndex: 'tradingAccount',
        key: 'tradingAccount',
      },
      {
        title: t('Pages.LowerLevelCustomers.ChineseName'),   // 中文名
        dataIndex: 'chineseName',
        key: 'chineseName',
        render: (_: unknown, record: resultListType) => (<span>{record.familyName + record.givenName}</span>),  //处理格式
      },
      {
        title: t('Pages.LowerLevelCustomers.EnglishName'),   // 英文名
        dataIndex: 'englishName',
        key: 'englishName',
        render: (_: unknown, record: resultListType) => (<span>{record.firstName + ' ' + record.lastName}</span>),  //处理格式
      },
      {
        title: t('Pages.LowerLevelCustomers.Balance'), // 余额
        dataIndex: 'balance',
        key: 'balance',
        render: (text: number) => (<span>{text !== undefined ? '$' + String(text) : ''}</span>),
      },
    ]
    const list = clientTypes === '300' ? partnersList : traderList
    return list as TableProps<any>['columns']
  };

  // 表格数据源
  tableDataLoader = async (searchParams: any) => {
    const { clientTypes, pageNumber, pageSize } = searchParams

    const handleSearchParams = {
      clientTypes,
      pageNumber,
      pageSize,
      // ...searchParams,
    };

    const {
      data: { resultList: list, ...otherData },
    } = await getCustomerList({ ...handleSearchParams })

    //根据客户类型 更新表头
    const { setFieldsValue = () => {} } = this.searchForm || {}
    setFieldsValue({ clientTypes }) // 设置客户类型


    function buildTree(items: resultListType[]) {
      const itemMap: { [key: string]: resultListType } = {}
      let treeArr: resultListType[] = []

      // 第一次遍历：创建所有节点的映射，并初始化children数组
      items.forEach(item => {
        itemMap[item.reference] = { ...item }
        treeArr.push(itemMap[item.reference]) // 将所有节点添加到数组中
      });

      // 第二次遍历：建立父子关系
      items.forEach((item: resultListType) => {
        if (item.upper && itemMap[item.upper]) {
          itemMap[item.upper].children = [itemMap[item.reference]]
          treeArr = treeArr.filter(data => data.reference !== item.reference)  // 删除已处理的节点
        }
      });

      return treeArr
    }

    const result = buildTree(list)

    return {
      ...otherData,
      list: result,
    };
  };

  // 表格搜索字段
  getSearchFields() {
    const { t } = this.props

    return [
      {
        label: t('Pages.LowerLevelCustomers.CustomerType'), // 客户类型
        name: 'clientTypes',
        type: 'select',
        itemProps: {
          initialValue: '300', // 默认选中交易员
        },
        props: {
          allowClear: false,
          options: [
            { label: t('Pages.LowerLevelCustomers.Partners'), value: '300' }, // 合作方
            { label: t('Pages.LowerLevelCustomers.Trader'), value: '200' }, // 交易员
          ],
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
        <TopTitle title={this.props.t('Pages.LowerLevelCustomers.CustomerList')} />
        <div className="customer-list-table">
          {this.renderSearch({})}
          {this.renderTable({
            rowKey: 'tradingAccount',  //设置主键
            scroll: {
              // x: 1300, //设置宽度
            },
            tableProps: {
              rowSelection:{
                selectedRowKeys: [this.state.selectedRowKey], // 当前选中行
                type: 'radio', // 单选模式
                hideSelectAll: true, // 隐藏全选按钮
                renderCell: (): React.ReactNode => null, // 隐藏选择框
              },
              //行部分
              onRow: (record: resultListType) => ({
                onClick: () => {
                  this.setState({ selectedRowKey: record.tradingAccount })
                },
              }),
              //展开部分
              expandable: {
                onExpand: (_: unknown, record: resultListType) => {
                  this.setState({ selectedRowKey: record.tradingAccount })
                }
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
            label: t('Pages.LowerLevelCustomers.CustomerList'),
          },
        ],
        title: t('Pages.LowerLevelCustomers.CustomerList'),
      };
    })(memo(CustomerList))
  )
);
