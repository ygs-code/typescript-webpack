import "./index.scss";

import { message, Button, Input, Alert } from "antd";
// import {
//   createPermission,
//   editPermission,
//   getPermissionInfo,
//   getPermissionList
// } from "src/assets/js/request";
import FormPage from "src/components/FormPage";
import LazySelect from "src/components/LazySelect";
import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle";
import { mapRedux } from "src/redux";
import { addRouterApi, routePaths } from "src/router";
import Time from "../components/Time";
import SignificanceLevel from "../components/SignificanceLevel";
import { GetAccountInfo, RealNameAuthentication, GetRegionResidence } from "@/apis";
import dayjs, { Dayjs } from 'dayjs';
import EmailPhone from '@/components/EmailPhone';
import ModalForm from '@/components/ModalForm';
import CertificateUpload from '@/pages/PersonalDataWrite/components/CertificateUpload';
import Email from '@/pages/PersonalDataWrite/components/Email';
import Phone from '@/pages/PersonalDataWrite/components/Phone';
import TopTag from "src/components/TopTag";
import TopTitle from '@/components/TopTitle';
import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';






interface InitData {
  /**日期时间 */
  date?: string;
  /**休市时的文本 */
  /*
    1正常交易日  2节假期
  */
  // marketClose?: string;
  /**地区 */
  region?: string;
  /**重要程度 */
  /**事件 */
  event?: string;
  /**公布值 */
  actual?: string;
  /**预测 */
  forecast?: string;
  /**前值 */
  previous?: string;
  description?: string;
  id?: string;
  name?: string;
  authKey?: string;
  dateOfBirth?: Dayjs | Date | string | undefined;
  parentId?: string;
  chineseName?: {
    lastName?: string;
    prefixName?: string;
  };
  englishName?: {
    lastName?: string;
    prefixName?: string;
  };
  importance: {
    level: number | string | undefined;
    type: number | string | undefined;
  };
  marketClose?: string | undefined;
}
interface SubmitData {
  /**日期时间 */
  date?: string;
  /**休市时的文本 */
  /*
    1正常交易日  2节假期
  */
  // marketClose?: string;
  /**地区 */
  region?: string;
  /**重要程度 */
  /**事件 */
  event?: string;
  /**公布值 */
  actual?: string;
  /**预测 */
  forecast?: string;
  /**前值 */
  previous?: string;
  id?: string;
  importance?: {
    level: number | string | undefined;
    type: number | string | undefined;
  };
  marketClose?: string;
  givenName?: string;
  familyName?: string;
  lastName?: string;
  firstName?: string;
  /**手机号码 */
  mobile?: {
    phone?: string;
    region?: {
      value?: string;
      alpha2Code?: string;
      callingCodes?: string[];
    };
  };
  /**国家代码 */
  alpha2Code?: string;
  callingCodes?: string;
  dateOfBirth: Date | string;
  filePaths?: Array<any>

}



interface Props {
  match: {
    params: {
      id?: string;
      action?: string;
    };
  };
  history: {
    back: () => void;
  };
}

class Index extends FormPage {
  action = 'edit'
  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.state,
      open: false
    };
  }

  /**
   * 用于将从接口获取到的初始化数据，转换成form需要的格式
   * 这个函数需要在getInitData中手动调用，因此函数名不限于mapInitData
   */


  mapInitData = async (initData: SubmitData): Promise<InitData> => {
    let {
      mobile,
      alpha2Code,
      callingCodes,
      givenName,
      familyName,
      lastName,
      firstName,
      dateOfBirth,
      filePaths = [],
      ...more
    } = initData;

    let data = {}

    if (filePaths.length) {
      data = {
        filePaths: {
          frontImg: {
            url: filePaths[0]?.sasUrl,
            status: 'done',
            fileName: filePaths[0]?.fileName,
            containerName: filePaths[0]?.containerName,
            storageAccountName: filePaths[0]?.storageAccountName,
          },
          behindImg: {
            url: filePaths[1].sasUrl,
            status: 'done',
            fileName: filePaths[1]?.fileName,
            containerName: filePaths[1]?.containerName,
            storageAccountName: filePaths[1]?.storageAccountName,
          }
        },
      }
    }






    return {
      mobile: {
        phone: mobile,
        region
          : {
          value: alpha2Code,
          alpha2Code,
          callingCodes
        }
      },


      ...data,

      dateOfBirth: dateOfBirth ? dayjs(dateOfBirth) : undefined,
      chineseName: {
        lastName: givenName,
        prefixName: familyName,
      },
      englishName: {
        lastName,
        prefixName: firstName,
      },

      ...more
    };


  };
  // 初始化值
  getInitialValues = async () => {
    const {
      match: {
        params: { id }
      } = {}
    } = this.props;


    // 获取详情
    const { data } = await GetAccountInfo(id);

    console.log('data====', data)




    return await this.mapInitData(data);
  };

  /**
   * 用于将form的字段值转换为接口需要的格式
   */
  mapSubmitData = (formData: InitData): SubmitData => {
    const {
      chineseName = {},
      englishName = {},
      dateOfBirth,
      filePaths = {},
      mobile = {},
      ...more
    } = formData;



    const {
      phone,
      region
      : {
        alpha2Code,
        callingCodes
      }
    } = mobile

    // /**存储账号名 */
    // storageAccountName: string;
    // /**容器名 */
    // containerName: string;
    // /**文件名 */
    // fileName: string;

    return {
      mobile: phone,
      alpha2Code,
      callingCodes,
      filePaths: [
        {
          fileName: filePaths.frontImg.fileName,
          containerName: filePaths.frontImg.containerName,
          storageAccountName: filePaths.frontImg.storageAccountName,
        }, {
          fileName: filePaths.behindImg
            .fileName,
          containerName: filePaths.behindImg
            .containerName,
          storageAccountName: filePaths.behindImg
            .storageAccountName,
        }

      ],
      dateOfBirth: dayjs(dateOfBirth).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      givenName: chineseName.lastName,
      familyName: chineseName.prefixName,
      lastName: englishName.lastName,
      firstName: englishName.prefixName,
      ...more
    };
  };
  // 提交请求到接口
  onSubmitForm = async (formData: InitData): Promise<any> => {
    const {
      history: { back },
      match: {
        params: { id, action }
      }
    } = this.props;


    const values: SubmitData = await this.mapSubmitData(formData);

    return values
  };



  getFields = () => {
    const {
      match: {
        params: { action }
      } = {},

    } = this.props;


    const {
      open,
      loading,
      sourceData: { reviewStatus, reasonForRejection } = {}
    } = this.state

    const {
      setFieldsValue = () => { },
      getFieldsValue = () => { }
    } = this.form || {};

    const {
      importance: { type } = {},
      documentType,
    } = getFieldsValue(['importance', 'documentType']) || {}



    // let reviewStatus = 1


    const readOnly = reviewStatus == 0
    return reviewStatus == 1 ? [
      {
        label: "证件号码",
        name: "documentNumber",
        type: "text",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },
      {
        label: "中文名字",
        name: "chineseName",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
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
          return <div> {prefixName}{lastName}</ div>
        },
        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },
      {
        label: "英文名字",
        name: "englishName",
        type: "text",
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
          return <div>{prefixName}{lastName}</ div>
        },
        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },
      {
        label: "邮箱",
        name: "email",
        type: "text",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        itemProps: {
          extra: '添加或者修改邮箱需要验证邮箱'
        },
        rules: [
          {
            required: true,
            message: "必填"
          }
        ],

        render: ({
          value,
          onChange
        }: {
          value: string; onChange: Function
        }) => {
          return <Email action='details' disabled={readOnly} value={value} onChange={onChange} />
        }
      },
      {
        label: "手机号码",
        name: "mobile",
        type: "input",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        itemProps: {
          extra: '添加或者修改邮箱需要验证邮箱'
        },

        render: (props) => {
          const { value, onChange } = props;
          return <Phone action='details' disabled={readOnly} value={value} onChange={onChange} />

        },

        rules: [
          {
            required: true,
            validator: (_: any, $value = {}) => {
              const {
                phone,
                region: {
                  value
                } = {}
              } = $value

              if (!value) {
                return Promise.reject(new Error('请选择地区'));

              }

              if (!phone) {
                return Promise.reject(new Error('请输入手机号码'));

              }


              return Promise.resolve();
            }
          }

        ]
      },
      {
        label: "出生日期",
        name: "dateOfBirth",
        type: "DatePicker",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },

        render: ({ value }) => {


          return <div> {dayjs(value).format("YYYY/MM/DD")} </div>


        },

        rules: [
          {
            required: true,
            message: "请选择时间"
          }
        ]
      },
      {
        label: "居住住址",
        name: "residentialAddress",
        type: "text",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },

        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },

    ] : [
      {
        label: "居民身份所在地",
        name: "placeOfResidence",
        type: "lazySelect",
        props: {
          readOnly,
          fieldNames: {
            label: "nativeName",
            value: "commonName"
          },
          searchKey: "name",
          loadData: async (searchParams: any) => {
            let { data = [] } = await GetRegionResidence();
            return {
              data: {
                list: data
              }
            }

          }
        },
        rules: [
          {
            required: true,
            message: "请选择"
          }
        ]
      },
      {
        label: "证件类型",
        name: "documentType",
        type: "select",
        itemProps: {
          initialValue: "ID",
          onChange: () => {

            this.forceUpdate();
          }
        },
        props: {
          readOnly,
          allowClear: false,
          options: [
            {
              label: "居民身份",
              value: "ID"
            },
            {
              label: "护照",
              value: "Passport"
            },

          ],
        },

        rules: [
          {
            required: true,
            message: "请选择"
          }
        ]
      },
      {
        label: "上传证件",
        name: "filePaths",
        render: (props: any) => {
          return <CertificateUpload disabled={readOnly}
            readOnly={readOnly}   {...props} type={documentType}> </CertificateUpload>
        },


        rules: [
          {
            required: true,
            validator: (_: any, value: { behindImg?: { url?: string; status?: string }; frontImg?: { url?: string; status?: string } } = {}) => {
              const {
                behindImg = {},
                frontImg = {}
              } = value






              if (!behindImg.url || !frontImg.url) {
                return Promise.reject(new Error('请上传证件'));

              }

              if (behindImg.status == 'error' || frontImg.status == 'error') {
                return Promise.reject(new Error('证件上传失败,请删除重新上传'));

              }

              if (behindImg.status == "uploading" || frontImg.status == "uploading") {
                return Promise.reject(new Error('证件上传中，请稍后'));

              }

              return Promise.resolve();
            }
          }

        ]
      },
      {
        label: "证件号码",
        name: "documentNumber",
        type: "input",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },
      {
        label: "中文名字",
        name: "chineseName",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
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
              readOnly={readOnly}
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
              readOnly={readOnly}
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
        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },
      {
        label: "英文名字",
        name: "englishName",
        // type: "lazySelect",
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
              readOnly={readOnly}
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
              readOnly={readOnly}
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
        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },
      {
        label: "邮箱",
        name: "email",
        type: "input",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        itemProps: {
          extra: '添加或者修改邮箱需要验证邮箱'
        },
        rules: [
          {
            required: true,
            message: "必填"
          }
        ],

        render: ({
          value,
          onChange
        }: {
          value: string; onChange: Function
        }) => {
          return <Email disabled={readOnly} value={value} onChange={onChange} />
        }
      },
      {
        label: "手机号码",
        name: "mobile",
        type: "input",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        itemProps: {
          extra: '添加或者修改邮箱需要验证邮箱'
        },
        //  itemProps: {
        //    extra:'添加或者修改邮箱需要验证邮箱'
        // },
        render: (props) => {
          const { value, onChange } = props;
          return <Phone disabled={readOnly} value={value} onChange={onChange} />
          // return <EmailPhone
          //   readOnly={readOnly}
          //   disabled={readOnly}
          //   type={'phone'}
          //   value={value}
          //   onChange={(v) => {


          //     onChange(v)
          //   }}
          // />
        },
        // rules: [
        //   {
        //     required: true,
        //     message: "请选择"
        //   },

        // ],
        rules: [
          {
            required: true,
            validator: (_: any, $value = {}) => {
              const {
                phone,
                region: {
                  value
                } = {}
              } = $value

              if (!value) {
                return Promise.reject(new Error('请选择地区'));

              }

              if (!phone) {
                return Promise.reject(new Error('请输入手机号码'));

              }


              return Promise.resolve();
            }
          }

        ]
      },
      {
        label: "出生日期",
        name: "dateOfBirth",
        type: "DatePicker",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },

        rules: [
          {
            required: true,
            message: "请选择时间"
          }
        ]
      },
      {
        label: "居住住址",
        name: "residentialAddress",
        type: "input",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },

        rules: [
          {
            required: true,
            message: "必填"
          }
        ]
      },

    ]
  };

  componentDidMount() { }
  // 底部按钮
  getFooter = () => null
  render() {
    const {
      open,
      loading,
      sourceData: { reviewStatus, reasonForRejection } = {}
    } = this.state
    const {
      history: { back },
      match: {
        params: { id, action }
      },
      t
    } = this.props;

    return (
      <div className="form-page personal-data-write">
        <div style={
          {
            width: '100%',
          }
        }>

          {/* 
          
          0 待审核
          1 已审核
          2 驳回
          
          */}
          {
            reviewStatus === 0 || reviewStatus === 1 || reviewStatus === 2 ? null : <TopTag />
          }

          {
            reviewStatus === 0 ? <Alert
              className="personal-data-write-alert"
              message="审核中"
              description="客服资料审核中，请耐心等"
              type="info"
              showIcon
            /> : null
          }

          {
            reviewStatus === 2 ? <Alert
              className="personal-data-write-alert"
              message="已驳回"
              description={`驳回原因：${reasonForRejection}`}
              type="error"
              showIcon
            /> : null
          }

          <TopTitle title={t("Pages.PersonalInfoWrite.PersonalData")} />

          <div className="personal-data-write-form-box">{this.renderForm()}</div>

          <div className="personal-data-write-button-box">


            {

              reviewStatus === 0 || reviewStatus === 1 ? null : <Button type="primary"
                style={{
                  padding: '0 40px'
                }}
                loading={loading} onClick={async () => {

                  await this.onValidaForm()
                  this.setState({
                    open: true
                  })

                }}>
                {
                  reviewStatus == 2 ? '重新提交' : '提交'
                }
              </Button>

            }

            {
              reviewStatus == 1 ? <div className="personal-data-write-button-box-tip">
                <span>*</span>
                {
                  reviewStatus == 2 ? '被驳回后需要重新修改资料再次提交资料，提交后锁定资料不能再次修改，等待后台审核。' : '点击提交后锁定资料不能再次修改，等待后台审核。'
                }

              </div> : null
            }


          </div>




          <ModalForm
            formProps={{
              layout: "horizontal",
              labelCol: {
                span: 6,
              },
              wrapperCol: {
                span: 20,
              }
            }}
            modalProps={{
              title: '确认',
              width: 600
            }}
            onOk={async (values: any) => {
              let $values = await this.onValidaForm()
              $values = await this.onSubmitForm($values)
              const data = await RealNameAuthentication({ ...$values });
              this.onReload()
              this.setState({
                open: false
              })
              message.success("操作成功")
              return values
            }}

            onCancel={() => {
              this.setState({
                open: false
              })
            }}
            open={open}
            getInitialValues={async (_this: any) => {



              const values = await this.onValidaForm()
              console.log('values===', values)
              return values

            }}
            getFields={(_this: any) => {
              const {
                setFieldsValue = () => { },
                getFieldsValue = () => { }
              } = _this.form || {};
              let readOnly = true

              return [
                {
                  label: "居民身份所在地",
                  name: "placeOfResidence",
                  type: "lazySelect",
                  props: {
                    readOnly,
                    fieldNames: {
                      label: "nativeName",
                      value: "commonName"
                    },
                    searchKey: "name",
                    loadData: async (searchParams: any) => {
                      let { data = [] } = await GetRegionResidence();
                      return {
                        data: {
                          list: data
                        }
                      }

                    }
                  },
                  rules: [
                    {
                      required: true,
                      message: "请选择"
                    }
                  ]
                },
                {
                  label: "证件类型",
                  name: "documentType",
                  type: "select",
                  itemProps: {
                    initialValue: "ID",
                    onChange: () => {

                      this.forceUpdate();
                    }
                  },
                  props: {
                    readOnly,
                    allowClear: false,
                    options: [
                      {
                        label: "居民身份",
                        value: "ID"
                      },
                      {
                        label: "护照",
                        value: "Passport"
                      },

                    ],
                  },

                  rules: [
                    {
                      required: true,
                      message: "请选择"
                    }
                  ]
                },

                {
                  label: "证件号码",
                  name: "documentNumber",
                  type: "input",
                  props: {
                    readOnly,
                    showCount: true,
                    maxLength: 100
                  },
                  rules: [
                    {
                      required: true,
                      message: "必填"
                    }
                  ]
                },
                {
                  label: "中文名字",
                  name: "chineseName",
                  props: {
                    readOnly,
                    showCount: true,
                    maxLength: 100
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
                    return <Input
                      value={`${prefixName}${lastName}`}
                      disabled
                    > </ Input>
                  },
                  rules: [
                    {
                      required: true,
                      message: "必填"
                    }
                  ]
                },
                {
                  label: "英文名字",
                  name: "englishName",
                  // type: "lazySelect",
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
                    return <Input
                      value={`${prefixName}${lastName}`}
                      disabled
                    ></ Input>
                  },
                  rules: [
                    {
                      required: true,
                      message: "必填"
                    }
                  ]
                },
                {
                  label: "邮箱",
                  name: "email",
                  type: "input",
                  props: {
                    readOnly,
                    showCount: true,
                    maxLength: 100
                  },
                  rules: [
                    {
                      required: true,
                      message: "必填"
                    }
                  ],
                },
                {
                  label: "手机号码",
                  name: "mobile",
                  type: "input",
                  props: {
                    readOnly,
                    showCount: true,
                    maxLength: 100
                  },
                  itemProps: {
                  },
                  render: (props) => {
                    const { value, onChange } = props;
                    return <Phone disabled={readOnly} value={value} onChange={onChange} />
                  },
                  rules: [
                    {
                      required: true,
                      validator: (_: any, $value = {}) => {
                        const {
                          phone,
                          region: {
                            value
                          } = {}
                        } = $value

                        if (!value) {
                          return Promise.reject(new Error('请选择地区'));

                        }

                        if (!phone) {
                          return Promise.reject(new Error('请输入手机号码'));

                        }


                        return Promise.resolve();
                      }
                    }

                  ]
                },
                {
                  label: "出生日期",
                  name: "dateOfBirth",
                  type: "DatePicker",
                  props: {
                    readOnly,
                    showCount: true,
                    maxLength: 100
                  },

                  rules: [
                    {
                      required: true,
                      message: "请选择时间"
                    }
                  ]
                },
                {
                  label: "居住住址",
                  name: "residentialAddress",
                  type: "input",
                  props: {
                    readOnly,
                    showCount: true,
                    maxLength: 100
                  },

                  rules: [
                    {
                      required: true,
                      message: "必填"
                    }
                  ]
                },

              ]
            }}
          />

        </div>



      </div>
    );
  }
}

export default withTranslation()(mapRedux()(
  // 权限控制
  setBreadcrumbAndTitle(
    (props) => {
      const {
        match: {
          params: {
            action
          } = {}
        }
      } = props

      const mapText: { [key: string]: string } = {
        create: '创建',
        view: '查看',
        edit: '编辑',
        review: '审核'
      }





      return {
        //设置面包屑和标题
        breadcrumb: [
          {
            label: "客户审核",
            path: routePaths.customerReview
          },
          {
            label: mapText[action] || ''
          }
        ],

        title: `客户审核/${mapText[action]}`
      }
    }





  )(addRouterApi(Index))
));
