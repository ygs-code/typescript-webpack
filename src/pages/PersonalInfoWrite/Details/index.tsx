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
import { GetRegistration, RealNameAuthentication, GetRegionResidence } from "@/apis";
import dayjs, { Dayjs } from 'dayjs';
import EmailPhone from '@/components/EmailPhone';
import ModalForm from '@/components/ModalForm';
import CertificateUpload from '@/pages/PersonalInfoWrite/components/CertificateUpload';
import Email from '@/pages/PersonalInfoWrite/components/Email';
import Phone from '@/pages/PersonalInfoWrite/components/Phone';
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



interface Props extends WithTranslation {
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
  // action = 'edit'
  // constructor(props: Props) {
  //   super(props);
  //   this.state = {
  //     ...this.state,
  //     open: false
  //   };
  // }
  action = 'edit';
  state: any = { ...this.state, open: false };
  private historyBack: () => void;
  private matchParams: { id?: string; action?: string };
  private t: any;

  constructor(props: Props) {
    super(props);
    const { history, match, t } = props;
    this.historyBack = history.back;
    this.matchParams = match.params;
    this.t = t
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
            url: filePaths[0]?.sasUrl || '',
            status: 'done',
            fileName: filePaths[0]?.fileName,
            containerName: filePaths[0]?.containerName,
            storageAccountName: filePaths[0]?.storageAccountName,
          },
          behindImg: {
            url: filePaths[1]?.sasUrl || '',
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
    const { id } = this.matchParams
    // 获取详情
    const { data } = await GetRegistration(id);
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

    const values: SubmitData = await this.mapSubmitData(formData);

    return values
  };



  getFields = () => {
    const t = this.t
    const {
      open,
      loading,
      sourceData: { reviewStatus, reasonForRejection } = {}
    } = this.state

    const {
      getFieldsValue = () => { }
    } = this.form || {};

    const {
      importance: { type } = {},
      documentType,
    } = getFieldsValue(['importance', 'documentType']) || {}



    // let reviewStatus = 2
    
    //已审核只读
    const readOnly = reviewStatus == 1
    // 是否驳回
    return reviewStatus == 2 ? [
      {
        label: t("Pages.PersonalInfoWrite.IdNumber"), // 证件号码
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
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.ChineseNa"), // 中文名字
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
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.EnglishNa"), // 英文名字
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
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.Email"), // 邮箱
        name: "email",
        type: "text",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        itemProps: {
          extra: t("Pages.PersonalInfoWrite.AddingEmailMsg") // 添加或者修改邮箱需要验证邮箱
        },
        rules: [
          {
            required: true,
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
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
        label: t("Pages.PersonalInfoWrite.PhoneNumber"), // 手机号码
        name: "mobile",
        type: "input",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        itemProps: {
          extra: t("Pages.PersonalInfoWrite.AddingEmailMsg") // 添加或者修改邮箱需要验证邮箱
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
                return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseSelectRegion"))); // 请选择地区

              }

              if (!phone) {
                return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseEnterMobilePhoneNumber"))); // 请输入手机号码

              }


              return Promise.resolve();
            }
          }

        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.DateOfBirth"), //出生日期
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
            message: t("Pages.PersonalInfoWrite.PleaseSelectTime"), //请选择时间
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.ResidentialAddress"), //居住住址
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
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
          }
        ]
      },

    ] : [
      {
        label: t("Pages.PersonalInfoWrite.PlaceOfResidence"), // 居民身份所在地,
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
            message: t("Pages.PersonalInfoWrite.PleaseSelect"), //请选择
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.DocumentType"), // 证件类型
        name: "documentType",
        type: "select",
        itemProps: {
          initialValue: "ID",
          onChange: () => this.forceUpdate(), // 触发重新渲染
        },
        props: {
          readOnly,
          allowClear: false,
          options: [
            {
              label: t("Pages.PersonalInfoWrite.IdCard"), //身份证
              value: "ID"
            },
            {
              label: t("Pages.PersonalInfoWrite.Passport"), //护照
              value: "Passport"
            },

          ],
        },

        rules: [
          {
            required: true,
            message: t("Pages.PersonalInfoWrite.PleaseSelect"), //请选择
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.UploadDocuments"), // 上传证件
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
                return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseUploadDocuments"))); // 请上传证件

              }

              if (behindImg.status == 'error' || frontImg.status == 'error') {
                return Promise.reject(new Error(t("Pages.PersonalInfoWrite.TheDocumentUploadFailed"))); // 证件上传失败

              }

              if (behindImg.status == "uploading" || frontImg.status == "uploading") {
                return Promise.reject(new Error(t("Pages.PersonalInfoWrite.TheCertificateIsBeingMsg"))); // 证件正在上传中

              }

              return Promise.resolve();
            }
          }

        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.IdNumber"), // 证件号码
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
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.ChineseNa"), // 中文姓名
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
              placeholder={t("Pages.PersonalInfoWrite.LastName")}
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
              placeholder={t("Pages.PersonalInfoWrite.FirstName")}
            ></Input>

          </ div>
        },
        rules: [
          {
            required: true,
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.EnglishNa"), // 英文名字
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
              placeholder="First Name"
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
              //  placeholder="名字"
              placeholder="Last Name"
            ></Input>

          </ div>
        },
        rules: [
          {
            required: true,
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.Email"), // 邮箱
        name: "email",
        type: "input",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        itemProps: {
          extra: t("Pages.PersonalInfoWrite.EmailVerificationMsg"), // 添加或者修改邮箱需要验证邮箱
        },
        rules: [
          {
            required: true,
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
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
        label: t("Pages.PersonalInfoWrite.PhoneNumber"), //手机号码
        name: "mobile",
        type: "input",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100
        },
        itemProps: {
          extra: t("Pages.PersonalInfoWrite.EmailVerificationMsg"), // 添加或者修改邮箱需要验证邮箱
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
                return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseSelectRegion"))); //请选择地区

              }

              if (!phone) {
                return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseEnterMobilePhoneNumber"))); //请输入手机号码

              }


              return Promise.resolve();
            }
          }

        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.DateOfBirth"), //出生日期
        name: "dateOfBirth",
        type: "DatePicker",
        props: {
          readOnly,
          showCount: true,
          maxLength: 100,
          placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
          format: "YYYY-MM-DD",
        },

        rules: [
          {
            required: true,
            message: t("Pages.PersonalInfoWrite.PleaseSelectTime"), //请选择时间
          }
        ]
      },
      {
        label: t("Pages.PersonalInfoWrite.ResidentialAddress"), //居住住址
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
            message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
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
    const t = this.t
    console.log('实名认证reviewStatusreviewStatus',reviewStatus);
    
    return (
      <div className="form-page personal-data-write">
        <div style={
          {
            width: '100%',
          }
        }>
          
          {/* 
          
          0 待审核 1 已审核 2 驳回
          0未提交审核，1未审核，2已审核通过，3已驳回
          
          */}
          {
            reviewStatus === 0 || reviewStatus === 1 || reviewStatus === 2 || reviewStatus === 3 ? null : <TopTag />
          }

          {
            reviewStatus === 1 ? <Alert
              className="personal-data-write-alert"
              message={t("Pages.PersonalInfoWrite.UnderReview")}// 审核中
              description={t("Pages.PersonalInfoWrite.CustomerServiceInformationReviewed")}// 客服资料审核中，请耐心等
              type="info"
              showIcon
            /> : null
          }

          {
            reviewStatus === 3 ? <Alert
              className="personal-data-write-alert"
              message={t("Pages.PersonalInfoWrite.Dismissed")} //已驳回
              description={`${t("Pages.PersonalInfoWrite.ReasonForRejection")}${reasonForRejection}`} //驳回原因：
              type="error"
              showIcon
            /> : null
          }

          <TopTitle title={t("Pages.PersonalInfoWrite.PersonalData")} />

          <div className="personal-data-write-form-box">{this.renderForm()}</div>

          <div className="personal-data-write-button-box">


            {

              reviewStatus === 1 || reviewStatus === 2 ? null : <Button type="primary"
                style={{
                  padding: '0 40px'
                }}
                loading={loading} 
                onClick={async () => {
                  await this.onValidaForm()
                  this.setState({
                    open: true
                  })

                }}>
                {
                  reviewStatus == 3 ? t("Pages.PersonalInfoWrite.Resubmit") : t("Pages.PersonalInfoWrite.Submit")  //重新提交  提交
                }
              </Button>

            }

            {
              reviewStatus != 2 ? (<div className="personal-data-write-button-box-tip">
                <span>*</span>
                { //被驳回后需要重新修改资料再次提交资料，提交后锁定资料不能再次修改，等待后台审核。
                  //点击提交后锁定资料不能再次修改，等待后台审核。
                  reviewStatus == 3 ? t("Pages.PersonalInfoWrite.RejectionMsg")
                    : t("Pages.PersonalInfoWrite.LockedInfoMsg")
                }

              </div>) : null
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
              title: t("Pages.PersonalInfoWrite.Confirm"), //确认
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
              message.success(t("Pages.PersonalInfoWrite.OperationSuccessful")) // 操作成功
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
                  label: t("Pages.PersonalInfoWrite.PlaceOfResidence"), // 居民身份所在地
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
                      message: t("Pages.PersonalInfoWrite.PleaseSelect"), //请选择
                    }
                  ]
                },
                {
                  label: t("Pages.PersonalInfoWrite.DocumentType"), // 证件类型
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
                        label: t("Pages.PersonalInfoWrite.IdCard"), //身份证
                        value: "ID"
                      },
                      {
                        label: t("Pages.PersonalInfoWrite.Passport"), //护照
                        value: "Passport"
                      },

                    ],
                  },

                  rules: [
                    {
                      required: true,
                      message: t("Pages.PersonalInfoWrite.PleaseSelect"), //请选择
                    }
                  ]
                },
                {
                  label: t("Pages.PersonalInfoWrite.IdNumber"), // 证件号码
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
                      message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
                    }
                  ]
                },

                {
                  label: t("Pages.PersonalInfoWrite.ChineseNa"), // 中文名字
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
                    />
                  },
                  rules: [
                    {
                      required: true,
                      message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
                    }
                  ]
                },


                {
                  label: t("Pages.PersonalInfoWrite.EnglishNa"), // 英文名字
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
                    />
                  },
                  rules: [
                    {
                      required: true,
                      message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
                    }
                  ]
                },

                {
                  label: t("Pages.PersonalInfoWrite.Email"), // 邮箱
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
                      message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
                    }
                  ],
                },
                {
                  label: t("Pages.PersonalInfoWrite.PhoneNumber"), //手机号码
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
                          return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseSelectRegion"))); //请选择地区

                        }

                        if (!phone) {
                          return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseEnterMobilePhoneNumber"))); //请输入手机号码

                        }


                        return Promise.resolve();
                      }
                    }

                  ]
                },
                {
                  label: t("Pages.PersonalInfoWrite.DateOfBirth"), //出生日期
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
                      message: t("Pages.PersonalInfoWrite.PleaseSelectTime"), //请选择时间
                    }
                  ]
                },
                {
                  label: t("Pages.PersonalInfoWrite.ResidentialAddress"), //居住住址
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
                      message: t("Pages.PersonalInfoWrite.IdNumber"), // 必填
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
        },
        t
      } = props

      const mapText: { [key: string]: string } = {
        create: t("Pages.PersonalInfoWrite.Create"), // 创建
        view: t("Pages.PersonalInfoWrite.View"), // 查看
        edit: t("Pages.PersonalInfoWrite.Edit"), // 编辑
        review: t("Pages.PersonalInfoWrite.Review"), // 审核
      }

      return {
        //设置面包屑和标题
        breadcrumb: [
          {
            label: t("Pages.PersonalInfoWrite.RealNameAuthentication"), // 实名认证
            path: routePaths.customerReview
          },
          {
            label: mapText[action] || ''
          }
        ],

        title: `${t("Pages.PersonalInfoWrite.RealNameAuthentication")}`
      }
    }





  )(addRouterApi(Index))
));
