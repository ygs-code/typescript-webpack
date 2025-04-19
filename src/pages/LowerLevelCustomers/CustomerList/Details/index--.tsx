import { getCustomerInfo } from 'src/apis';
import FormPage from 'src/components/FormPage';
import setBreadcrumbAndTitle from 'src/components/setBreadcrumbAndTitle';
import { mapRedux } from 'src/redux';
import { DatePicker, Input, Tag } from 'antd';
import { addRouterApi, routePaths } from 'src/router';
import dayjs from 'dayjs';
// import CertificateUpload from 'src/pages/CustomerManagement/CustomerReview/components/CertificateUpload';




const clientTypeMap = {
  100: '交易者',
  200: '合作方',
}

class CustomerDetails extends FormPage {
  /**调用API初始化表单数据 */
  getInitialValues = async () => {
    const {
      match: {
        params: { id }
      } = {}
    } = this.props;

    const { data } = await getCustomerInfo(id);
  


    return await this.mapInitData(data);
  };



  /**
 * 用于将从接口获取到的初始化数据，转换成form需要的格式
 * 这个函数需要在getInitData中手动调用，因此函数名不限于mapInitData
 */


  mapInitData = async (initData: any) => {
    const {
      givenName,
      familyName,
      lastName,
      firstName,
      filePaths = [],
      ...more
    } = initData;

    console.log()

    return {
      chineseName: {
        lastName: givenName,
        prefixName: familyName,
      },
      englishName: {
        lastName: lastName,
        prefixName: firstName,
      },
      // filePaths:CertificateUpload.mapInitData(filePaths),
      ...more
    };


  };


  /**配置表单 */
  getFields = () => {
    const {
      match: {
        params: { action }
      } = {},
    } = this.props;

    const {
      setFieldsValue = () => { },
      getFieldsValue = () => { }
    } = this.form || {};

    const readOnly = action === 'view';
    
    const {
      documentType,
    } = getFieldsValue(['documentType']) || {}

    return [
      // {
      //   label: '唯一标识',
      //   name: 'reference',
      //   type: 'input',
      //   props: {
      //     readOnly,
      //   },
      //   render: (props: { value: string }) => {
      //     const {
      //       value,
      //     } = props;
      //     return value || '无';
      //   }
      // },
      {
        label: '客户类型',
        name: 'clientTypes',
        type: 'select',
        props: {
          readOnly,
          options: [
            { value: 100, label: '交易者' },
            { value: 200, label: '合作方' },
          ],
        },
      },
      
      {
        label: '中文名',
        name: 'chineseName',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: {
          value: { lastName?: string; prefixName?: string },
          onChange: Function
        }) => {
          const {
            value: {
              lastName = '',
              prefixName = '',
            } = {

            },
            onChange
          } = props
          
          return <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Input
              value={prefixName}
              disabled={readOnly}
              style={{
                width: 'calc(50% - 5px)'
              }}
              onChange={({
                target: {
                  value: v
                }
              }) => {
                onChange({
                  lastName,
                  prefixName: v,
                })
              }}
            ></Input>
            <Input
              disabled={readOnly}
              value={lastName}
              style={{
                width: 'calc(50% - 5px)'
              }}

              onChange={({
                target: {
                  value: v
                }
              }) => {
                onChange({
                  lastName: v,
                  prefixName,
                })
              }}
            ></Input>

          </ div>
        },
      },
      {
        label: '英文名',
        name: 'englishName',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: {
          value: { lastName?: string; prefixName?: string },
          onChange: Function
        }) => {
          const {
            value: {
              lastName = '',
              prefixName = '',
            } = {

            },
            onChange
          } = props

          return <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Input
              disabled={readOnly}
              value={prefixName}
              style={{
                width: 'calc(50% - 5px)'
              }}
              onChange={({
                target: {
                  value: v
                }
              }) => {
                onChange({
                  lastName,
                  prefixName: v,
                })
              }}
            ></Input>
            <Input
              disabled={readOnly}
              value={lastName}
              style={{
                width: 'calc(50% - 5px)'
              }}

              onChange={({
                target: {
                  value: v
                }
              }) => {
                onChange({
                  lastName: v,
                  prefixName,
                })
              }}
            ></Input>

          </ div>
        },
      },

      {
        label: '邮箱',
        name: 'email',
        type: 'input',
        props: {
          readOnly,
        },
      },
      {
        label: '备用邮箱',
        name: 'altEmail',
        type: 'input',
        props: {
          readOnly,
        },
      },
      {
        label: '地区代码',
        name: 'alpha2Code',
        type: 'input',
        props: {
          readOnly,
        },
      },
      {
        label: '电话区号',
        name: 'callingCodes',
        type: 'input',
        props: {
          readOnly,
        },
      },
      {
        label: '手机号',
        name: 'mobile',
        type: 'input',
        props: {
          readOnly,
        },
      },
      {
        label: '备用手机号',
        name: 'altMobile',
        type: 'input',
        props: {
          readOnly,
        },
      },
      {
        label: '居民身份所在地',
        name: 'placeOfResidence',
        type: 'input',
        props: {
          readOnly,
        },
      },
      {
        label: '证件类型',
        name: 'documentType',
        type: 'select',
        props: {
          readOnly,
          options: [
            { value: 'ID', label: '身份证' },
            { value: 'Passport', label: '护照' },
          ],
        },
      },
      {
        label: "证件照片",
        name: "filePaths",
        // render: (props: any) => {
        //   return  props.value? <CertificateUpload readOnly={false} {...props} type={documentType}> </CertificateUpload> : '无'
        // },
      },
      {
        label: '证件号码',
        name: 'documentNumber',
        type: 'input',
        props: {
          readOnly,
        },
      },
      {
        label: '出生日期',
        name: 'dateOfBirth',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: { value: Date }) => {
          return <DatePicker value={props.value ? dayjs(props.value) : null} format="YYYY-MM-DD HH:mm:ss" placeholder='' disabled style={{width: '100%'}} />;
        }
      },
      {
        label: '居住地址',
        name: 'certificateAddress',
        type: 'input',
        props: {
          readOnly,
        },
      },
      
      {
        label: '实名认证状态',
        name: 'isRealNameAuth',
        // type: 'input',
        props: {
          readOnly,
        },
        render: (props: { value: boolean }) => {
          const {
            value,
          } = props;

          return value ? <Tag color='success'>已完成</Tag> : <Tag color='orange'>未完成</Tag>;
        }
      },
      {
        label: '公司编号',
        name: 'companyCode',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: { value: string }) => {
          const {
            value,
          } = props;
          return value || '无';
        }
      },
      {
        label: '注册日期',
        name: 'created',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: { value: Date }) => {
          return props.value ? dayjs(props.value).format('YYYY-MM-DD HH:mm:ss') : '';
          // return <DatePicker value={props.value ? dayjs(props.value) : null} format="YYYY-MM-DD HH:mm:ss" placeholder='' disabled style={{width: '100%'}} />;
        }
      },
      {
        label: '关联的真实交易账号',
        name: 'relatedTradingAccounts',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: { value: { tradingAccount: string }[] }) => {
          const {
            value = [],
          } = props
          return value.length > 0 ?
          value.map((item: { tradingAccount: string }) => {
            return item.tradingAccount
          }).join(',')
          : '无'
        }
      },
      {
        label: '激活状态',
        name: 'isActive',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: { value: boolean }) => {
          const {
            value,
          } = props;
          return value ? <Tag color='success'>启用</Tag> : <Tag color='error'>禁用</Tag>;
        }
      },
      {
        label: '所属销售团队',
        name: 'relatedSalesTeam',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: { value: string }) => {
          const {
            value,
          } = props;
          return value || '无';
        }
      },
      {
        label: 'IB编号',
        name: 'ib',
        type: 'input',
        props: {
          readOnly,
        },
        render: (props: { value: string }) => {
          const {
            value,
          } = props;
          return value || '无';
        }
      },
      
      // {
      //   label: '',
      //   name: '',
      //   type: 'input',
      //   props: {
      //     readOnly,
      //   },
      // },
    ]
  }

  /**渲染表单 */
  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    );
  }
}

export default mapRedux()(
  // 权限控制
  setBreadcrumbAndTitle({
    //设置面包屑和标题
    breadcrumb: [
      {
        laebl: '客户管理',
      },
      {
        label: '用户管理',
        path: routePaths.customerManagement
      },
      {
        label: '用户详情'
      }
    ],
    title: '用户详情'
  })(addRouterApi(CustomerDetails))
);