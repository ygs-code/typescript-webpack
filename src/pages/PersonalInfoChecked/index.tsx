import "./index.scss"
import TopTitle from "@/components/TopTitle"
import DetailsForm from "src/components/DetailsForm"
import PersonalInfoModal from "./PersonalInfoModal"

import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle"
import { memo, FC, useState, useEffect } from "react"
import TopTag from "src/components/TopTag";
import { useTranslation } from 'react-i18next'

import { Button, Form, message } from 'antd';

import { DetailsFormProps, FormItemProps, SlotComponentProps } from '@/types/detailsForm'
import { postFileUpload, getRegionCode, realNameAuthentication } from "src/apis/page/personalInfoWrite"

import type { GetProp, UploadFile, UploadProps } from 'antd';

import { mapRedux } from '@/redux';
import CheckEmailAndMobile from "./CheckEmailAndMobile"
import id_card_obverse from 'static/images/id_card_obverse.png'
import id_card_reverse from 'static/images/id_card_reverse.png'

// 权限控制
const PersonalInfoWrite: FC<DetailsFormProps> = (props) => {

  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()

  const { userInfo } = props.state.user
  //是否已经验证邮箱和手机
  console.log(props, userInfo.isEmailVerified, userInfo.isMobileVerified, userInfo.isRealNameAuth, 'PersonalInfoWrite');  
  // action的类型 create view edit review
  // const action = props.match.params.action
  // const action = 'view'
  // const disabled = action === 'view'
  // 控制表单禁用
  const [formDisabled, setFormDisabled] = useState(false);
  const [formReadOnly, setFormReadOnly] = useState(false)
  // const [formReadOnly, setFormReadOnly] = useState(userInfo.isRealNameAuth)
  // 所在地 区域代码
  // const [regionCodeOptions, setRegionCodeOptions] = useState([])
  // 居民所在地
  const [placeOfResidence, setPlaceOfResidence] = useState([])

  useEffect(() => {
    getRegionCode().then(res => {
      console.log(res, 'resresresres')
      if (res.data && res.data.length > 0) {
        //所在地 区域代码
        // const handleData = res.data.map((item: { alpha2Code: string; callingCodes: string; nativeName: string; commonName: string; }) =>
        //   ({ ...item, label: item.callingCodes + ' ' + item.nativeName, value: item.callingCodes + ' ' + item.nativeName }))
        // setRegionCodeOptions([...handleData])
        //居民所在地
        const handleData2 = res.data.map((item: { alpha2Code: string; callingCodes: string; nativeName: string; commonName: string; }) =>
          ({ ...item, label: item.nativeName, value: item.callingCodes + ' ' + item.nativeName }))
        setPlaceOfResidence([...handleData2])
      }
    })


  }, [])
  

  const [fileListData, setFileListData] = useState<UploadFile[][]>([
    [], []
  ])

  const [filePaths, setFilePaths] = useState([{}, {}])

  const handleCustomRequest = async ({ file, onSuccess, onError, onProgress }, index) => {
    const formData = new FormData();
    formData.append('file', file); // Add file to FormData
    formData.append('fileType', 'frontOfIDCard');
    try {
      const uploadRes = await postFileUpload(formData);
      const responseData = uploadRes.data;
      let data = filePaths 
      data[index] = uploadRes.data
      console.log(data, 'datadatadatadatadata');
      
      setFilePaths([...data])

      onSuccess(responseData);
      // message.success('文件上传成功！');
    } catch (error) {
      onError(error);
      // message.error('文件上传失败！');
    }
  };

  const handleChange = ({ fileList: newFileList }, index: number) => {
    console.log(newFileList, 'newFileListnewFileListnewFileList');
    // setFileList(newFileList)
    let data = fileListData
    data[index] = newFileList
    setFileListData([...data])

  }
  //预览功能
  // const [previewOpen, setPreviewOpen] = useState(false);
  //   const [previewImage, setPreviewImage] = useState('');
  //   const getBase64 = (file: FileType): Promise<string> =>
  //     new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result as string);
  //       reader.onerror = (error) => reject(error);
  //     });
  //   const handlePreview = async (file: UploadFile) => {
  //     if (!file.url && !file.preview) {
  //       file.preview = await getBase64(file.originFileObj as FileType);
  //     }
  
  //     setPreviewImage(file.url || (file.preview as string));
  //     setPreviewOpen(true);
  //   };
  

  const [checkType, setCheckType] = useState('email')

  const [isOpenCheck, setIsOpenCheck] = useState(false)
  const checkMobileClick = (type: string) => {
    console.log('checkMobileClick')
    setCheckType(type)
    setIsOpenCheck(!isOpenCheck)
  }
  //更新 绑定的 手机号 邮箱
  const bindEmailOrPhone = (type: string, datas: { emailPhone: { email?: string; mobile?: string; }, code: string }) => {
    console.log(datas, 'bindEmailOrPhone');
    form.setFieldValue(type, datas)
  }

  //DetailsForm的控制渲染数据
  const formItemPropData: [FormItemProps | FormItemProps[], SlotComponentProps][] = [
    [
      {
        name: 'placeOfResidence',
        label: t("Pages.PersonalInfoWrite.PlaceOfResidence"), // 居民身份所在地
        rules: [
          {
            required: true,
            message: t("Pages.PersonalInfoWrite.PleaseSelect"),
          },
        ],
      },
      {
        type: 'Select',
        props: {
          placeholder: t("Pages.PersonalInfoWrite.PleaseSelect"),
          options: placeOfResidence,
          showSearch: true
        },
      },
    ],
    [
      {
        name: 'documentType',
        label: t("Pages.PersonalInfoWrite.DocumentType"), // 证件类型
        rules: [
          {
            required: true,
            message: t("Pages.PersonalInfoWrite.PleaseSelect"),
          },
        ],
      },
      {
        type: 'Select',
        props: {
          placeholder: t("Pages.PersonalInfoWrite.PleaseSelect"), //请选择
          options: [
            { label: t("Pages.PersonalInfoWrite.IdCard"), value: 'ID' },  //身份证
            { label: t("Pages.PersonalInfoWrite.Passport"), value: 'Passport' }, //护照
          ],
        },
      },
    ],
    [
      {
        name: 'uploadCard',
        label: t("Pages.PersonalInfoWrite.UploadDocuments"), // 上传证件
        // rules: [
        //   { required: true, message: '请输入卡号' },
        //   //input的校验规则
        //   { pattern: /^\d+$/, message: '只能输入数字' }
        // ],
      },
      {
        type: 'UploadCard',
        options: [
          {
            props: {
              listType: "picture-card",
              fileList: fileListData[0],
              onChange: e => handleChange(e, 0),
              customRequest: e => handleCustomRequest(e, 0),
              // onPreview: handlePreview
            },
            datas: {
              imgUrl: id_card_obverse,
              content: t("Pages.PersonalInfoWrite.ClickToUploadTheFrontPictureOfYourIdCard")  //点击上传身份证正面图片
            },
          },
          {
            props: {
              listType: "picture-card",
              fileList: fileListData[1],
              onChange: e => handleChange(e, 1),
              customRequest: e => handleCustomRequest(e, 1),
            },
            datas: {
              imgUrl: id_card_reverse,
              content: t("Pages.PersonalInfoWrite.ClickToUploadTheFrontPictureOfYourIdCard") //点击上传身份证背面图片
            }
          },
        ]
      },
    ],
    [
      {
        name: 'documentNumber',
        label: t("Pages.PersonalInfoWrite.IdNumber"), // 证件号码
        rules: [
          { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
          //input的校验规则
          { pattern: /^\d+$/, message: t("Pages.PersonalInfoWrite.OnlyNumbersCanBeEntered") }
        ],
      },
      {
        type: 'Input',
        props: {
          placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
        },
      },
    ],
    [
      [
        {
          name: 'familyName',
          label: t("Pages.PersonalInfoWrite.ChineseSurname"),// 中文姓
          rules: [
            { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
          ],
        },
        {
          name: 'givenName',
          label: t("Pages.PersonalInfoWrite.ChineseName"),// 中文名
          rules: [
            { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
          ],
        }
      ],
      {
        type: 'MultipleInputs',
        options: [
          {
            props: {
              placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
            },
          },
          {
            props: {
              placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
            },
          },
        ]
      },
    ],
    [
      [
        {
          name: 'lastName',
          label: t("Pages.PersonalInfoWrite.EnglishSurname"), // 英文姓
          rules: [
            { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
          ],
        },
        {
          name: 'firstName',
          label: t("Pages.PersonalInfoWrite.EnglishName"), // 英文名
          rules: [
            { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
          ],
        }
      ],
      {
        type: 'MultipleInputs',
        options: [
          {
            props: {
              placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
            },
          },
          {
            props: {
              placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
            },
          },
        ]
      },
    ],
    [
      {
        name: 'email',
        label: t("Pages.PersonalInfoWrite.Email"), //电子邮箱
      },
      {
        type: 'Input',
        props: (userInfo.isEmailVerified ? 
        {
          variant: 'borderless',
          readOnly: true,
          addonAfter: (<Button onClick={() => checkMobileClick('email')}>{t("Pages.PersonalInfoWrite.ModifyEmail")}</Button>) //修改邮箱
        } : {
          placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
          readOnly: true,
          onClick: () => checkMobileClick('email'),
        }),
      },
    ],
    [
      {
        name: 'mobile',
        label: t("Pages.PersonalInfoWrite.PhoneNumber"), //手机号码
        rules: [
          { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
        ],
      },
      {
        type: 'Input',
        props: (userInfo.isEmailVerified ? 
          {
            variant: 'borderless',
            readOnly: true,
            addonAfter: (<Button onClick={() => checkMobileClick('mobile')}>{t("Pages.PersonalInfoWrite.ModifyPhoneMumber")}</Button>) //修改手机号码
          } : {
            placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
            readOnly: true,
            onClick: () => checkMobileClick('mobile'),
          }),
      },
      // [
      //   {
      //     name: 'mobile',
      //     label: t("Pages.PersonalInfoWrite.PhoneNumber"), //手机号码
      //     rules: [
      //       { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
      //       //input的校验规则
      //       { pattern: /^\d+$/, message: t("Pages.PersonalInfoWrite.OnlyNumbersCanBeEntered") }
      //     ],
      //   },
      //   {
      //     name: 'callingCodes',
      //     label: t("Pages.PersonalInfoWrite.PhoneNumber"), //手机地区码
      //     rules: [
      //       { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
      //     ],
      //   },
      // ],
      // {
      //   type: 'PhoneInput',
      //   options: [
      //     {
      //       props: {
      //         placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
      //       },
      //     },
      //     {
      //       props: {
      //         style: { width: '150px' },
      //         options: regionCodeOptions,
      //         showSearch: true,
              
      //       }
      //     }
      //   ]
      // },
    ],
    [
      {
        name: 'dateOfBirth',
        label: t("Pages.PersonalInfoWrite.DateOfBirth"), //出生日期
        rules: [
          { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
        ],
      },
      {
        type: 'DatePicker',
        props: {
          placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
          format: "YYYY-MM-DD",
        },
      },
    ],
    [
      {
        name: 'residentialAddress',
        label: t("Pages.PersonalInfoWrite.Address"), // 住址
        rules: [
          { required: true, message: t("Pages.PersonalInfoWrite.PleaseEnter") },
        ],
      },
      {
        type: 'Input',
        props: {
          placeholder: t("Pages.PersonalInfoWrite.PleaseEnter"),
        },
      },
    ],
    [
      {
        name: 'Button',
      },
      {
        type: 'Button',
        props: {
          type: 'primary',
          htmlType: 'submit',
          style: {
            width: '160px',
            height: '40px',
            borderRadius: '4px',
          },
        },
        content: t("Pages.PersonalInfoWrite.Submit"), //提交
      },
    ],
  ];

  // 校验规则提示信息
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  }
  // 填写的个人信息表单数据
  const [formInfoData, setformInfoData] = useState({})
  // 弹窗状态
  const [isOpen, setIsOpen] = useState(false);
  // 提交成功后的回调
  const onFinish = (values: any) => {
    

    const dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD')
    const callingCodes = values.callingCodes.split(' ')[0]
    const placeOfResidence = values.placeOfResidence.split(' ').slice(1).join(' ')
    const params = { ...values, dateOfBirth, filePaths, placeOfResidence, callingCodes }
    setformInfoData(params)
    setIsOpen(true)
  }

  const submitModelForm = () => {
    const values = form.getFieldsValue()
    const dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD')
    const callingCodes = values.callingCodes.split(' ')[0]
    const placeOfResidence = values.placeOfResidence.split(' ').slice(1).join(' ')
    const params = { ...values, dateOfBirth, filePaths, placeOfResidence, callingCodes }

    console.log(params, 'onFinishonFinishonFinish');

    realNameAuthentication(params).then(res => {
      if (res.data) {
        form.resetFields()
        messageApi.open({ type: 'success', content: t("Pages.PersonalInfoWrite.SubmissionSuccessful") })
      }
    }).catch(err => {
      messageApi.open({ type: 'error', content: 'err' })
    })

    setIsOpen(!isOpen)
  }

  // const formSubmit = async (values: any) => {}

  const [form] = Form.useForm()

  const initialValues = {
    placeOfResidence: '',
    documentType: '',
    uploadCard: '',
    documentNumber: '',
    familyName: '',
    givenName: '',
    lastName: '',
    firstName: '',
    email: userInfo.email,
    mobile: userInfo.mobile,
    dateOfBirth: '',
    residentialAddress: '',
    Button: ''
  }

  const formProps = {
    name: 'personalInfoFo',
    disabled: formDisabled,
    onFinish,
    validateMessages,
    form, // 确保传递 form 实例
    labelCol: { span: 12 },
    wrapperCol: { span: 24 },
    style: { maxWidth: 482 },
    layout: 'vertical', //layout="vertical | horizonta | linline"
    initialValues
  }
  

  return (
    <>
      {contextHolder}
      <div>
        <TopTag />
        <TopTitle title={t("Pages.PersonalInfoWrite.PersonalData")} /> {/* 个人资料 */}
        <div className="password-box">
          <DetailsForm
            formItemPropData={formItemPropData}
            formProps={formProps}
            formDisabled={formDisabled}
            formReadOnly={formReadOnly}
          />
        </div>
        {
          !formDisabled && (
            <div className="bottom-span-div">
              <span className="bottom-span-require">* </span>
              <span className="bottom-span-content">{t("Pages.PersonalInfoWrite.BottomSpanMsg")}</span> {/* 为了您的账户安全，请确保您的个人资料真实有效 */}
            </div>
          )
        }
        {isOpen && (
          <PersonalInfoModal
            formInfoData={formInfoData}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            submitModelForm={submitModelForm}
          />)}

        {isOpenCheck && (
        <CheckEmailAndMobile
          isOpen={isOpenCheck}
          setIsOpen={setIsOpenCheck}
          type={checkType}
          onSubmit={(type, values) => bindEmailOrPhone(type, values)}
        />)}



      </div>
    </>
  )
}

export default mapRedux()(setBreadcrumbAndTitle({
  // 设置面包屑和标题
  breadcrumb: [
    {
      label: "个人资料"
    }
  ],
  title: "个人资料"
})(memo(PersonalInfoWrite)))