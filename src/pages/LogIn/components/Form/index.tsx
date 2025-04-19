'use client';
import { useEffect, useState } from 'react';
import cn from 'classnames';
// import { cn } from "@/lib/utils"
import type { FormProps } from 'antd';
// import { useRouter } from "@/lib/i18n"
import { Button, Checkbox, Form, Input, Flex, Select, Row, Col, Mentions, message } from 'antd';
import EmailPhone from '@/components/EmailPhone';
import { InputCode } from '@/components/VerificationCode';
import { EmailOrSmsSendCode, Register, Login, GetUserInfo } from '@/apis';
import { addRouterApi, Link } from 'src/router';
// import Link from 'next/link';
import { emailReg, passwordReg } from '@/utils';
import { codeReg } from "@/utils";
import Token from '@/apis/request/token';
import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';

import './index.scss';


type RegionType = {
  nativeName?: string;
  commonName?: string;
  alpha2Code?: string;
  callingCodes?: string[];
};

type FieldType = {
  code?: string;
  password?: string;
  remember?: string;
  email?: string;
  phone?: string;
  region?: RegionType;
  emailPhone?: {
    email?: string;
    phone?: string;
    region?: RegionType;
  };
};
interface LoginFormProps {
  routePaths: { index: string, resetPassword: string, register: string }
  formName: string;
  pushRoute: (str: string) => void;
}
const LoginForm = (props: LoginFormProps) => {
  const {
    formName,
    pushRoute,
    routePaths
  } = props
  const { t } = useTranslation()


  const [isUseEmail, setIsUseEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const {
    getFieldsValue,
    getFieldValue,
    setFieldsValue
  } = form

  const [rememberAccount, setRememberAccount] = useState<{ isUseEmail?: boolean, account?: any, remember?: boolean }>({});
  const {
    isUseEmail: $isUseEmail = isUseEmail,
    account,
    remember
  } = rememberAccount

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    const {
      emailPhone: {
        email,
        phone,
        region: {
          nativeName,
          commonName,
          alpha2Code,
          callingCodes
        } = {}
      } = {},
      code,
      password
    } = values
    setLoading(true)
    let data = await
      Login(
        {
          Password: password,
          LoginType: "LoginByPwd",
          Captcha: code,
          ...(isUseEmail ? {
            Email: email,
          } : {
            "RegionDic": {
              nativeName,
              commonName,
              alpha2Code,
              callingCodes
            },
            Mobile: phone,
          })
        }
      ).then(async ({ data }) => {
        Token.set(data)
        await GetUserInfo(
          {},
          {
            requestOptions: {
              globalErrorMessage: false,
              // 默认全局展示请求成功信息
              globalSuccessMessage: false,
              globalErrorRedirect: false
            }
          }
        )


        message.success(t('Pages.login.loginSuccessful'))
        setTimeout(() => {

          pushRoute(routePaths.index)


        }, 1000)
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })




  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {

  };





  useEffect(() => {

    let $rememberAccount = JSON.parse(window.localStorage.getItem(
      'rememberAccount'
    ) || "{}")
    if (Object.keys($rememberAccount).length < 0) onEmailOrPhoneChange(true);
    
    setRememberAccount($rememberAccount)
    //初始set isUseEmail
    setIsUseEmail(($rememberAccount.isUseEmail === undefined || $rememberAccount.isUseEmail === null) ? isUseEmail : $rememberAccount.isUseEmail )
    setFieldsValue({
      emailPhone: $rememberAccount.account,
      remember: $rememberAccount.remember,
    })


    // AccountInfo()


  }, []);





  const onEmailOrPhoneChange = (value: boolean) => {
    setFieldsValue({
      emailPhone: undefined
    })

    const remember = getFieldValue('remember')

    if (remember) {
      localStorage.setItem('rememberAccount', JSON.stringify({
        isUseEmail: value,
        // account: emailPhone,
        remember
      }))
    } else {
      localStorage.setItem('rememberAccount', JSON.stringify({
        isUseEmail: value,
      }))
    }

    setIsUseEmail(value)
  }

  return (
    <div className='login-form'>
      <Form
        form={form}
        name={formName}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ minWidth: 300, margin: 'auto', maxWidth: 360 }}
        size='large'
        initialValues={{ remember, emailPhone: account }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark={true}
      >

        {/* 登录 */}
        {(
          <>
            <Form.Item
              name="emailPhone" label={

                <div className='text-[#49505E]' >
                  <span onClick={() => onEmailOrPhoneChange(true)} className={


                    cn('text-[#49505E] hover:text-[#49505E]', 'login-form-account',


                      'login-form-account',
                      isUseEmail ? 'login-form-account-active' : '',

                      // isUseEmail && 'text-[#d4a767] hover:text-[#d4a767]  relative        after:content-[""] after:absolute after:left-0 after:right-0  after:bottom-[-2px] after:h-0.5     after:bg-[#d4a767]   '



                    )}>{t('Pages.login.registerForm_email')}



                  </span>
                  <span className='login-form-line'>|</span>
                  <span onClick={() => onEmailOrPhoneChange(false)} className={
                    cn('text-[#49505E] hover:text-[#49505E]', 'login-form-account',
                      'login-form-account',
                      !isUseEmail ? 'login-form-account-active' : '',)
                  }    >{t('Pages.login.registerForm_phone')}</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  validator: (rule, value = {}) => {
                    const {
                      email,
                      phone,
                      region
                    } = value
                    if (isUseEmail) {
                      if (!email) {
                        return Promise.reject(t('Components.EmailPhone.email.verify1'))
                      }


                      if (!email.match(emailReg)) {
                        return Promise.reject(t('Components.EmailPhone.email.verify2'))
                      }
                    } else {

                      if (!region) {
                        return Promise.reject(t('Components.EmailPhone.phone.verify3'))
                      }

                      if (!phone) {
                        return Promise.reject(t('Components.EmailPhone.phone.verify1'))
                      }
                    }
                    return Promise.resolve()
                  }
                }]}


            >

              <EmailPhone
                onChange={(v) => {
                  const remember = getFieldValue('remember')
                  if (remember) {
                    localStorage.setItem('rememberAccount', JSON.stringify({
                      isUseEmail,
                      account: v,
                      remember
                    }))
                  } else {
                    localStorage.setItem('rememberAccount', JSON.stringify({

                    }))
                  }
                  console.log('v==', v)
                }}
                type={isUseEmail ? 'email' : 'phone'} value={{ email: '', phone: '' }} />

            </Form.Item>




            <Form.Item<FieldType>
              label={t('Pages.login.loginForm_password')}
              name="password"
              rules={[
                // { required: true, message: '' },
                // { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,16}$/, message: t('err_msg_pwd') }
                // ,
                {
                  required: true,
                  validator: (rule, value = '',) => {
                    const confirmPassword = getFieldValue('confirmPassword')
                    if (value.trim() === '') {
                      return Promise.reject(t('Pages.login.inputPassword'))
                    }
                    if (!value.match(passwordReg)) {
                      return Promise.reject(t('Pages.login.err_msg_pwd'))
                    }
                    // if (confirmPassword && confirmPassword !== value) {
                    //   return Promise.reject(t('passwordInconsistency'))
                    // }


                    return Promise.resolve()
                  }
                }
              ]}
            >
              <Input.Password />
            </Form.Item>


            <Form.Item<FieldType>
              label={t('Pages.login.registerForm_verificationCode')}
              name="code"
              rules={[
                // { required: true, message: '' },
                // { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,16}$/, message: t('err_msg_pwd') }
                // ,
                {
                  required: true,
                  validator: (rule, value = '',) => {
                    if (!value.trim()) {
                      return Promise.reject(t('Components.VerificationCode.captcha.verify1'))

                    }

                    if (!value.match(codeReg)) {
                      return Promise.reject(t('Components.VerificationCode.captcha.verify2'))
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <InputCode />
            </Form.Item>

            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className='text-gray-500'
                    onChange={({
                      target: { checked }
                    }) => {
                      const emailPhone = getFieldValue('emailPhone')
                      if (checked) {
                        localStorage.setItem('rememberAccount', JSON.stringify({
                          isUseEmail,
                          account: emailPhone,
                          remember: checked
                        }))
                      } else {
                        localStorage.setItem('rememberAccount', JSON.stringify({
                          isUseEmail
                        }))
                      }
                    }}
                  >{t('Pages.login.loginForm_remember')}</Checkbox>
                </Form.Item>
                {/* <Link href="/reset-password" className="theme-color"> */}
                <span

                  onClick={() => {
                    pushRoute(routePaths.resetPassword)
                  }}

                  className='theme-color span-cursor'>{t('Pages.login.loginForm_forgot')}</span>
                {/* </Link> */}
              </Flex>
            </Form.Item>

            <Form.Item label={null} labelCol={{ span: 0 }} >
              <Button
                loading={loading}
                type="primary" htmlType="submit" block className='mb-1'>
                {
                  t('Pages.login.loginForm_button')
                }
              </Button>
              <span className=''> {t('Pages.login.or')}
                {/* <Link href="/register" > */}
                <span
                  onClick={() => {
                    pushRoute(routePaths.register)
                  }} className='ml-2 theme-color span-cursor' style={{
                    marginLeft: '8px',
                  }}>{t('Pages.login.loginForm_signup')}</span>
                {/* </Link> */}
              </span>
            </Form.Item>
          </>
        )}



      </Form>
    </div>
  )
}

export default addRouterApi(LoginForm)

