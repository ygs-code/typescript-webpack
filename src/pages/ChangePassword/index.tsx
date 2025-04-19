import "./index.scss"
import TopTitle from "@/components/TopTitle"
import DetailsForm from "src/components/DetailsForm"

import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle"
import { memo, FC, useState } from "react"
import TopTag from "src/components/TopTag";
import { useTranslation, withTranslation } from 'react-i18next'

import { Form, message } from 'antd';

import { FormItemProps, SlotComponentProps } from '@/types/detailsForm'
import { postResetPassword } from "src/apis/page/changePassword"

// 权限控制
const ChangePasswordPage: FC = () => {
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState<boolean>(false)

  const passwordValidator = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t("Pages.ChangePassword.PleaseEnterPassword")));
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error(t("Validators.NeedUppercaseMsg")));
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(new Error(t("Validators.NeedLowercaseMsg")));
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(new Error(t("Validators.NeedOneNumMsg")));
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      return Promise.reject(new Error(t("Validators.NeedOneSpecialMsg")));
    }
    if (value.length < 8 || value.length > 15) {
      return Promise.reject(new Error(t("Validators.8to15Msg")));
    }
    return Promise.resolve();
  };

  //DetailsForm的控制渲染数据
  const formItemPropData: [FormItemProps | FormItemProps[], SlotComponentProps][] = [
    [
      {
        name: 'originalPassword',
        label: t("Pages.ChangePassword.EnterExistingPassword"),  //输入现有密码
        rules: [
          { required: true, message: t("Pages.ChangePassword.PleaseEnterPassword") },
        ],
      },
      {
        type: 'PasswordInput',
        props: {
          placeholder: t("Pages.ChangePassword.PleaseEnterPassword"),
        },
      },
    ],
    [
      {
        name: 'newPassword',
        label: t("Pages.ChangePassword.EnterNewPassword"), // 输入新密码
        rules: [
          { required: true, validator: passwordValidator },
        ],
      },
      {
        type: 'PasswordInput',
        props: {
          placeholder: t("Pages.ChangePassword.PleaseEnterPassword"),
        },
        showSpan: true,
        spanContent: t("Pages.ChangePassword.RequiredMsg") //8-15个字符,需包含至少一个大写和小写字母、数字、特殊字符
      },
    ],
    [
      {
        name: 'reNewPassword',
        label: t("Pages.ChangePassword.ReEnterNewPassword"), // 再次输入新密码
        rules: [
          { required: true, message: t("Pages.ChangePassword.PleaseConfirmPassword") }, // 请确认密码
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t("Pages.ChangePassword.PasswordsDifferentMsg")));// 两次输入的密码不一致!
            },
          }),
        ]
      },
      {
        type: 'PasswordInput',
        props: {
          placeholder: t("Pages.ChangePassword.PleaseEnterPassword"),
        },
      },
    ],
    [
      [
        {
          name: 'Button1', //占位
        },
        {
          name: 'Button2', //占位
        },
      ],
      {
        type: 'MultipleButtons',
        options: [
          {
            props: {
              type: 'primary',
              htmlType: 'submit',
              style: {
                width: '160px',
                height: '40px',
                borderRadius: '4px',
              },
            },
            content: t("Pages.ChangePassword.Submit"),
          },
          {
            props: {
              htmlType: 'button',
              style: {
                width: '160px',
                height: '40px',
                borderRadius: '4px',
                marginLeft: '16px',
              },
              onClick: () => form.resetFields()
            },
            content: t("Pages.ChangePassword.Cancel"),
          }
        ],
      },
    ],

  ];

  const [form] = Form.useForm()

  // 提交成功后的回调
  const onFinish = (values: { originalPassword: string; newPassword: string; reNewPassword: string; }) => {
    setLoading(true)
    postResetPassword(values).then(res => {
      form.resetFields()
      setLoading(false)
      messageApi.open({ type: 'success', content: t("Pages.ChangePassword.ModificationSuccessful") }) //修改成功！
    }).catch(err => {
      setLoading(false)
      // messageApi.open({ type: 'error', content: t("Pages.ChangePassword.ModificationFailed") }) //修改失败！
    })
  };


  const formProps = {
    name: 'formName',
    disabled: false,
    onFinish,
    form, // 确保传递 form 实例
    labelCol: { span: 12 },
    wrapperCol: { span: 24 },
    style: { maxWidth: 482 },
    layout: 'vertical', //layout="vertical | horizonta | linline"
    // initialValues
  }

  return (
    <div>
      {contextHolder}
      <TopTag />
      {/* 更改密码 */}
      <TopTitle title={t("Pages.ChangePassword.ChangePassword")} />
      <div className="password-box">
        <DetailsForm
          formItemPropData={formItemPropData}
          formProps={formProps}
          formLoading={loading}
        />
      </div>
    </div>
  )
}

export default withTranslation()(setBreadcrumbAndTitle(
  (props: { t: (key: string) => string }) => {
    const { t } = props
    // 设置面包屑和标题
    return {
      breadcrumb: [
        {
          label: t("Pages.ChangePassword.ChangePassword")
        }
      ],
      title: t("Pages.ChangePassword.ChangePassword")
    }
  })(memo(ChangePasswordPage)))