import React, { Component } from 'react';
import { mapRedux } from '@/redux';
import { addRouterApi, routePaths } from 'src/router';
import setBreadcrumbAndTitle from '@components/setBreadcrumbAndTitle';
import { tablePage } from 'src/components/TablePage';
import { RouterProps } from 'src/apis/request/globalMessage';
import { Button, TableProps, Tag } from 'antd';
import { CustomerInfoBase, getRegistrationInfoList, Input4QueryCustomer } from 'src/apis';
import TableButton from 'src/components/TableButton';
import TopTitle from '@/components/TopTitle';



 


@(tablePage<React.ComponentType>)
class CustomerReview extends Component<RouterProps> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  // 表格搜索字段
  getSearchFields() {
    return [
      {
        label: '查询条件',
        name: 'multipleFields',
        type: 'multipleSelectInput',
        span: 1,
        // itemProps: {
        //   labelCol:{ span: 2 },
        //   wrapperCol:{ span: 14 }

        // },
        // render:()=>{}
        props: {
          selectProps: {
          },
          options: [
            {
              label: "姓名",
              value: 'familyName,givenName,firstName,lastName'
            },
            {
              label: "手机号",
              value: 'mobile'
            },
            {
              label: '邮箱',
              value: 'email'
            },
            {
              label: '身份证',
              value: 'documentNumber'
            }
          ],
        }
      },
    ];
  }

  getTableProps = () => {
    return {};
  };

  // 定义Tab字段
  getTabFilterItems = () => {
    return [
      {
        label: '全部',
        value: ''
      },
      {
        label: '未审核',
        value: '0'
      },
      {
        label: '已审核',
        value: '1'
      },
      {
        label: '已驳回',
        value: '2'
      }
    ];
  };

  // 定义表格列
  getColumns = () => {
    const { pushRoute, routePaths: { customerReviewDetails = "" } = {} } = this.props;
    return [
      {
        title: '唯一标识',
        dataIndex: 'reference',
        key: 'reference',
        // width: '20%',
        width: 300,
        hidden: true,
      },
      {
        title: '中文姓名',
        dataIndex: 'cnName',
        key: 'cnName',
        width: 100,
        render: (value: any, record: CustomerInfoBase) => `${record.familyName}${record.givenName}`,
      },
      {
        title: '英文姓名',
        dataIndex: 'enName',
        key: 'enName',
        width: 100,
        render: (value: any, record: CustomerInfoBase) => `${record.firstName}${record.lastName}`,
      },
      {
        title: '证件类型',
        dataIndex: 'placeOfResidence',
        key: 'placeOfResidence',
        width: 100,
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 200,
        render: (value: any, record: CustomerInfoBase) => `${record.callingCodes}${record.mobile}`,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 240,
      },
      {
        title: '证件号',
        dataIndex: 'documentNumber',
        key: 'documentNumber',
        width: 240,
      },
      {
        title: '审核状态',
        dataIndex: 'reviewStatus',
        key: 'reviewStatus',
        width: 100,
        render: (status: number) => {
          let color = '';
          let text = '';
          switch (status) {
            case 0:
              color = 'gold';
              text = '未审核';
              break;
            case 1:
              color = 'green';
              text = '已通过';
              break;
            case 2:
              color = 'red';
              text = '已驳回';
              break;
            default:
              color = 'default';
              text = '未知状态';
          }
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: '驳回原因',
        dataIndex: 'reasonForRejection',
        key: 'reasonForRejection',
        width: 300,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: "actions",
        fixed: "right",
        width: 200,
        render: (value, record) => {
          const { reference: id, reviewStatus } = record;
          return (
            <TableButton
              render={[
                {
                  label: "审核",
                  status: reviewStatus == 0,
                  color: '#d4a767',
                  props: {
                    onClick: () => {
                      pushRoute && pushRoute({
                        path: customerReviewDetails,
                        params: {
                          action: "review",
                          id
                        }
                      });
                    }
                  }
                },
                {
                  label: "编辑",
                  status: true,
                  color: '#247fff',
                  props: {
                    onClick: () => {
                      pushRoute && pushRoute({
                        path: customerReviewDetails,
                        params: {
                          action: "edit",
                          id
                        }
                      });
                    }
                  }
                },
                {
                  label: "查看",
                  status: true,
                  props: {
                    onClick: () => {
                      pushRoute && pushRoute({
                        path: customerReviewDetails,
                        params: {
                          action: "view",
                          id
                        }
                      });
                    }
                  }
                },
              ]}
            />
          );
        }
      }
    ] as TableProps<CustomerInfoBase>['columns'];
  };

  // 表格数据源
  tableDataLoader = async (searchParams: any) => {
    try {
      const {
        status: reviewStatus,

        multipleFields = {},
        ...otherParams
      } = searchParams;
      const {
        selectValue = [],
        inputValue = ''
      } = multipleFields

      let Keywords: string[] = inputValue === undefined || inputValue.trim() === '' ? [] : selectValue.reduce((acc: string, item: string) => {
        acc = acc + "," + item
        return acc
      }, '').split(',').filter((item: string) => item)


      let QueryText = inputValue


      const {
        data: { resultList: list, ...otherData },
      } = await getRegistrationInfoList(
        {
          reviewStatus,
          ...(Keywords.length ? {
            Keywords,
            QueryText
          } : {}),
          // orderby: 'LastUpdated',
          // descend: true,
          //         /**排序字段 */
          // orderby?: 'Created' | 'LastUpdated';
          // /**是否根据排序字段降序排序 */
          // descend?: boolean;

          ...otherParams
        });

      return {
        ...otherData,
        list: list,
      };
    } catch (error) {
      // console.log('error===', error)
    }
  };

  render() {
    const { pushRoute, routePaths: { customerReviewDetails = "" } = {} } = this.props;

    return (
      <>
        <div
          style={{
            marginBottom: "20px"
          }}>
          <Button
            type="primary"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#c29048'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#d4a767'; }}
            onClick={() => {
              pushRoute && pushRoute({
                path: customerReviewDetails,
                params: {
                  action: "create"
                }
              });
            }}>
            新增客户
          </Button>
        </div>

        {this.renderSearch({})}
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

export default mapRedux()(
  setBreadcrumbAndTitle({
    breadcrumb: [
      {
        label: '客户管理',
      },
      {
        label: '客户审核',
      }
    ],
    title: '客户审核',
  })(addRouterApi(CustomerReview))
);