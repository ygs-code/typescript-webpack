'use client';
import { useEffect, useState } from 'react';
// import { useRouter } from "@/lib/i18n"
import cn from 'classnames';
// 引入HOC高阶函数 withTranslation 和 i18n 的ts类型定义 WithTranslation
import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Flex, Select, Row, Col, Mentions, message } from 'antd';
import EmailPhone from '@/components/EmailPhone';
import VerificationCode from '@/components/VerificationCode';
import { addRouterApi, Link } from 'src/router';
import { emailReg, passwordReg } from '@/utils';
import {
  EmailOrSmsSendCode,
  CheckAccountExists, // 检查账号是否存在 
  // ResetPassword  // 重置密码
  UpsertPassword,
} from '@/apis';
import Token from "src/apis/request/token";
import './index.scss';
const { Option } = Select;
type EmailPhoneType = {
  email?: string;
  phone?: string;
  region?: {
    alpha2Code?: string;
    callingCodes?: string[];
    commonName?: string;
    nativeName?: string;
  };
};

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  email?: string;
  phone?: string;
  captcha?: string;
  region?: string;
  emailPhone?: EmailPhoneType;
  code?: string;
  confirmPassword?: string;
};




const LoginForm = ({ formName, onChangeProcedure = () => { }, pushRoute, routePaths }: { formName: string; onChangeProcedure: Function }) => {
  // const router = useRouter();
  const { t } = useTranslation()

  const [isAcceptCode, setIsAcceptCode] = useState(false);
  const [isUseEmail, setIsUseEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [procedure, setProcedure] = useState(1);

  const pushLogin = () => {
    console.log('pushLogin:', routePaths.logIn);
    
    pushRoute(routePaths.logIn)
  }

  useEffect(() => {
    // router.push('/');  
  }, []);


  const CheckAccount = async (values: any) => {

    const {
      password,
      code,
      emailPhone: {
        email,
        phone,
        region: {
          alpha2Code,
          callingCodes,
          commonName,
          nativeName,
        } = {}
      } = {}
    } = values



    setLoading(true)
    let data = await CheckAccountExists({
      Email: email,
      RegionDic: {
        nativeName,
        commonName,
        alpha2Code,
        callingCodes
      },
      Mobile: phone,
      // Password: password,
      // Code: code,
    }).then(() => {
      setProcedure(2)
      onChangeProcedure(2)
      setLoading(false)
    }).catch(() => {

      setLoading(false)
    })




    return false




  }


  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const {

      password,
      code,
      emailPhone: {
        email,
        phone,
        region: {
          alpha2Code,
          callingCodes,
          commonName,
          nativeName,
        } = {}
      } = {}
    } = values
    console.log('onFinish:', values);
    console.log('procedure:', values);
    if (procedure == 1) {

      await CheckAccount(values)

    }

  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = async (info) => {

    console.log('info:', info);

    const {
      errorFields = [],
      values: {
        password,
        code,
        emailPhone: {
          email,
          phone,
          region: {
            alpha2Code,
            callingCodes,
            commonName,
            nativeName,
          } = {}
        } = {}
      } = {}
    } = info
    if (errorFields.length) {
      return false
    }


    if (procedure == 1) {
      await CheckAccount(info.values)
      return false
    }


    setLoading(true)
    let data = await UpsertPassword({
      Email: email,
      RegionDic: {
        nativeName,
        commonName,
        alpha2Code,
        callingCodes
      },
      Mobile: phone,
      Password: password,
      Code: code,
    }).then((data) => {
      Token.set(data.data)
      pushLogin()
      // message.success(t('registeredSuccessfully'))
      // 操作成功
      setTimeout(() => {
        // router.push('/login');
      }, 1000)

      setLoading(false)
    }).catch(() => {

      setLoading(false)
    })





    console.log('Failed:', info);
  };



  useEffect(() => {

  }, []);

  const [form] = Form.useForm();
  const { getFieldsValue, getFieldValue, validateFields, setFieldsValue } = form

  const onEmailOrPhoneChange = (value: boolean) => {

    if (procedure == 2) {
      return false
    }

    setFieldsValue({
      emailPhone: undefined
    })
    setIsUseEmail(value)
  }
  return (
    <div className='reset-password-form'>
      <Form
        name={formName}
        form={form}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ minWidth: 300, margin: 'auto', maxWidth: 360 }}
        size='large'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      // autoComplete="off"
      // requiredMark={true}
      >



        {/* 注册 */}
        {(
          <>
            <Form.Item
              name="emailPhone" label={
                <div className='text-[#49505E]' >
                  <span onClick={() => onEmailOrPhoneChange(true)} className={
                    cn('text-[#49505E] hover:text-[#49505E]', 'login-form-account',
                      'login-form-account',
                      isUseEmail ? 'login-form-account-active' : '',
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
                    setIsAcceptCode(true)
                    return Promise.resolve()
                  }
                }]}

            >

              <EmailPhone disabled={procedure == 2} type={isUseEmail ? 'email' : 'phone'} value={{ email: '', phone: '' }} />

            </Form.Item>

            {

              procedure == 1 ? <Form.Item label={null} labelCol={{ span: 0 }} >
                <Button
                  loading={loading}
                  type="primary" htmlType="submit" block className='mb-1'

                >
                  {
                    t('Pages.login.nextStep')
                  }
                </Button>
                <span> {t('Pages.login.or')}
                  <span className="theme-color span-cursor" onClick={() => pushLogin()} style={{ marginLeft: '8px' }} >{t('Pages.login.loginForm_button')}</span>
                </span>
              </Form.Item> :
                <>
                  <Form.Item name="code" label={t('Pages.login.registerForm_verificationCode')}
                    rules={[{ required: true, message: t('Components.VerificationCode.captcha.verify1') }]}
                  >
                    <VerificationCode
                      value={getFieldValue('code')}
                      onChange={(value: string) => setFieldsValue({ code: value })}
                      isAcceptCode={isAcceptCode}
                      type={'GenAuthCaptcha'}
                      onSubmit={async (v: any) => {
                        const {
                          email,
                          phone,
                          region: {
                            alpha2Code,
                            callingCodes,
                            commonName,
                            nativeName,
                          } = {}
                        } = getFieldValue('emailPhone') || {}
                        // phone
                        console.log('phone==', getFieldValue('emailPhone'))


                        let parameter = {
                          RegionDic: {
                            nativeName,
                            commonName,
                            alpha2Code,
                            callingCodes
                          },
                          // EmailOrMobile: phone,
                          Email: email,
                          Mobile: phone,
                        }
                        // 更新token
                        let { data = '' } = await EmailOrSmsSendCode({
                          ...parameter,
                          ...v,
                        })
                        Token.set(data)
                        return data

                      }} />
                  </Form.Item>


                  {/* /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,16}$/ */}
                  {/* extra="8-16个字符,需包含至少一个大写和小写字母、数字、特殊字符" */}
                  <Form.Item<FieldType>
                    label={t('Pages.login.registerForm_password')}
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

                          validateFields(['confirmPassword'])
                          return Promise.resolve()
                        }
                      }
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>


                  <Form.Item<FieldType>
                    label={t('Pages.login.confirmPassword')}
                    name="confirmPassword"

                    rules={[

                      // { required: true, message: '' },
                      // { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,16}$/, message: t('err_msg_pwd') }
                      // ,
                      {
                        required: true,
                        validator: (rule, value = '',) => {
                          const password = getFieldValue('password')
                          if (value.trim() === '') {
                            return Promise.reject(t('Pages.login.inputPassword'))
                          }
                          if (!value.match(passwordReg)) {
                            return Promise.reject(t('Pages.login.err_msg_pwd'))
                          }
                          if (password && password !== value) {
                            return Promise.reject(t('Pages.login.passwordInconsistency'))

                          }
                          return Promise.resolve()
                        }
                      }
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item label={null} labelCol={{ span: 0 }} >
                    <div className='flex justify-between'>
                      <Button
                        loading={loading}
                        type="primary" block className='mb-1 mr-2'
                        onClick={() => {
                          setProcedure(1)
                          onChangeProcedure(1)
                        }}
                      >
                        {
                          t('Pages.login.lastStep')
                        }
                      </Button>
                      <Button
                        loading={loading}
                        style={{ marginTop: '24px' }}
                        type="primary" htmlType="submit" block className='mb-1 ml-2'>

                        {t('Common.confirm')}


                      </Button>
                    </div>


                    <span className=''> {t('Pages.login.or')}
                        <span className="theme-color span-cursor" onClick={() => pushLogin()} style={{ marginLeft: '8px' }}>{t('Pages.login.loginForm_button')}</span>

                    </span>
                  </Form.Item>

                </>
            }






          </>
        )
        }
      </Form >
    </div>
  )
}



export default addRouterApi(LoginForm);