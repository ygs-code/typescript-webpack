import { Button, message, Rate, Tag } from 'antd';
// import {getPermissionList, removePermission} from "src/assets/js/request";
import setBreadcrumbAndTitle from 'src/components/setBreadcrumbAndTitle';
import TableButton from 'src/components/TableButton';
import { tablePage } from 'src/components/TablePage';
import { addRouterApi } from 'src/router';
import React, { Component, JSX } from 'react';
import { mapRedux } from '@/redux';
import dayjs from 'dayjs';
import $Test from './test';


console.log('$Test==',$Test)


 

interface TestState {
  name: string;
}

//
interface TestProps {
  age: number;
}

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  fixed?: 'left' | 'right';
  width?: number;
  render?: (text: any, row: any) => JSX.Element;
}

interface IndexProps {
  pushRoute: (params: {
    path: string;
    params: { action: string; id?: string };
  }) => void;
  routePaths: {
    demoDetails: string;
    calendar: string;
    calendarDetails: string;
  };
}

//

// react  state 和 props
class Test extends Component<TestProps, TestState> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: 'Test',
    };
  }

  render() {
    const { age } = this.props;
    return <div>{this.state.name}</div>;
  }
}

// // // 权限控制
// @setBreadcrumbAndTitle((props) => {
//   return {
//     //设置面包屑和标题
//     breadcrumb: [
//       {
//         label: "日历"
//       }
//     ],
//     title: "日历"
//   }
// }
// )
// @addRouterApi<React.ComponentType>
@(tablePage<React.ComponentType>)
class Index extends Component<IndexProps> {
  tabsValueKey: string = 'publishStatus';

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  // 设置默认搜索参数
  getDefaultSearchParams() {
    return {
      orderby: 'Date',
      descend: true,
    };
  }

  // /**开始日期 */
  // startDate?: string;
  // /**结束日期 */
  // endDate?: string;
  // /**地区 */
  // region?: string;
  // /**重要程度 */
  // importance?: string;
  // /**日历创建者reference */
  // createdBy?: string;

  // 定义搜索栏字段
  getSearchFields() {
    return [
      // {
      //   label: "ID",
      //   name: "name",
      //   type: "input",
      //   span: 1
      // },
      {
        label: '时间',
        name: 'date',
        type: 'RangePicker',
      },

      {
        label: '重要程度',
        name: 'importance',
        type: 'select',
        props: {
          options: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '假期',
              value: 'Holiday',
            },
            {
              label: '等级1',
              value: '1',
            },
            {
              label: '等级2',
              value: '2',
            },
            {
              label: '等级3',
              value: '3',
            },
          ],
        },
      },
    ];
  }

  // 定义Tab字段
  getTabFilterItems = () => {
    return [
      {
        label: '全部',
        value: '',
      },
      {
        label: '待发布',
        value: '1',
      },
      {
        label: '已发布',
        value: '2',
      },
    ];
  };

  // 定义表头字段
  getColumns = () => {
    const { pushRoute, routePaths: { calendarDetails = '' } = {} } = this.props;
    return [
      {
        title: '时间',
        dataIndex: 'date',
        key: 'date',
        width: 200,
        render: (value: string, row) => {
          const { marketClose, importance } = row;
          return (
            dayjs(value).format(
              marketClose == 1 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
            ) + (marketClose == 1 ? '' : ` (${importance})`)
          );
        },
      },
      {
        title: '地区',
        dataIndex: 'region',
        key: 'region',
      },

      {
        title: '事件',
        dataIndex: 'event',
        key: 'event',
      },
      {
        title: '实际',
        dataIndex: 'actual',
        key: 'actual',
      },
      {
        title: '预测',
        dataIndex: 'forecast',
        key: 'forecast',
      },
      {
        title: '前值',
        dataIndex: 'previous',
        key: 'previous',
      },
      {
        title: '状态',
        dataIndex: 'publishStatus',
        key: 'publishStatus',
        render: (
          text: any,
          row: { reference: string; publishStatus: number }
        ) => {
          return text == 1 ? (
            <Tag color="orange">待发布</Tag>
          ) : (
            <Tag color="success"> 已发布 </Tag>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        width: 300,
        fixed: 'right',
        render: (
          text: any,
          row: { reference: string; publishStatus: number }
        ) => {
          const { reference: id, publishStatus, ...more } = row;

          return (
            <TableButton
              render={[
                {
                  showPopconfirm: true,
                  label: '发布',
                  color: '#d4a767',
                  status: publishStatus == 1,
                  props: {
                    onClick: async () => {
                      message.success('发布成功');
                      this.loadTableData();
                    },
                  },
                },
                {
                  label: '编辑',
                  status: true,
                  color: '',
                  props: {
                    onClick: () => {
                      pushRoute({
                        path: calendarDetails,
                        params: {
                          action: 'edit',
                          id,
                        },
                      });
                    },
                  },
                },
                {
                  label: '查看',
                  status: true,
                  props: {
                    onClick: () => {
                      pushRoute({
                        path: calendarDetails,
                        params: {
                          action: 'view',
                          id,
                        },
                      });
                    },
                  },
                },
                {
                  showPopconfirm: true,
                  label: '删除',
                  color: 'red',
                  status: true,
                  props: {
                    onClick: async () => {
                      message.success('删除成功');
                      this.loadTableData();
                    },
                  },
                },
              ]}
            />
          );
        },
      },
    ] as Column[];
  };

  /**
   * 定义表格的数据加载功能
   */
  tableDataLoader = async (
    searchParams: {
      date?: [dayjs.Dayjs, dayjs.Dayjs];
      [key: string]: any;
    } = {}
  ) => {
    const { date, ...more } = searchParams;
    const [startDate, endDate] = date || [undefined, undefined];

    // const {
    //   data: { resultList: list, ...otherData },
    // } = await getCalendarList({
    //   startDate: startDate
    //     ? dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')
    //     : undefined,
    //   endDate: endDate
    //     ? dayjs(endDate).format('YYYY-MM-DD 23:59:59')
    //     : undefined,
    //   ...more,
    // });

    return {
      // ...otherData,
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      list: [],
    };
  };

  getTableProps = () => {
    return {};
  };

  componentDidMount() {}
  render() {
    const { pushRoute, routePaths: { calendarDetails = '' } = {} } = this.props;

    return (
      <>
        <div
          style={{
            marginBottom: '20px',
          }}>
          <Button
            type="primary"
            onClick={() => {
              pushRoute({
                path: calendarDetails,
                params: {
                  action: 'create',
                }, // 地址传参
              });
            }}>
            新建日历
          </Button>
        </div>

        {this.renderSearch({
          // shrinkLength: 5,
          // initialValues: {
          //   type: ""
          // }
        })}

        {this.renderTabs()}
        {this.renderTable({
          rowKey: 'reference',
          scroll: {
            x: 1300,
          },
        })}
      </>
    );
  }
}

export default mapRedux()(Index);
