'use client';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Flex, Select, Row, Col, Mentions, message } from 'antd';
import EmailPhone from '@/components/EmailPhone';
import VerificationCode from '@/components/VerificationCode';
import { addRouterApi, Link } from 'src/router';
import { emailReg, passwordReg, getSearchParams } from '@/utils';
import { EmailOrSmsSendCode, Register } from '@/apis';
import Token from "src/apis/request/token";
import './index.scss';

// 引入HOC高阶函数 withTranslation 和 i18n 的ts类型定义 WithTranslation
import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';


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
  inviteCode?: string;
};

interface LoginFormProps {
  routePaths: { logIn: string }
  formName: string;
  pushRoute: (str: string) => void;
  type: string;
  form: any;
}




const checkForm = (props: LoginFormProps) => {

  const {
    type,
    form,
    formName,
    pushRoute,
    routePaths,
  } = props
  // const [form] = Form.useForm();
  const { getFieldsValue, getFieldValue, validateFields, setFieldsValue } = form;
  
  const { t } = useTranslation()
  const [isAcceptCode, setIsAcceptCode] = useState(false);
  const [isUseEmail, setIsUseEmail] = useState(type === 'email');
  const [loading, setLoading] = useState(false);


  console.log('props==', props)
  console.log('getSearchParams==', getSearchParams('code'))

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
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
          } = {},

        } = {},
        inviteCode = ''
      } = {}
    } = info
    if (errorFields.length) {
      return false
    }
    setLoading(true)
    let data = await Register({

      Email: email,
      Mobile: phone,
      RegionDic: {
        nativeName,
        commonName,
        alpha2Code,
        callingCodes
      },

      Password: password,
      Code: code,
      InviteCode: inviteCode
    }).then(() => {

      message.success(t('Pages.login.registeredSuccessfully'))
      setTimeout(() => {



        pushRoute(routePaths.logIn)


      }, 1000)

      setLoading(false)
    }).catch(() => {

      setLoading(false)
    })





    console.log('Failed:', info);
  };


  // const onEmailOrPhoneChange = (value: boolean) => {
  //   setFieldsValue({
  //     emailPhone: type === 'email'
  //   })
  //   setIsUseEmail(value)
  // }


  const code = getSearchParams('code')

  return (
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
      initialValues={{
        inviteCode: code,
      }}
    // autoComplete="off"
    // requiredMark={true}
    >



      {/* 注册 */}
      {(
        <>
          <Form.Item
            name="emailPhone" label={
              <div className='text-[#49505E]' >
                {
                  type === 'email'
                }
                <span className={
                  cn('text-[#49505E] hover:text-[#49505E]', 'login-form-account',

                    'login-form-account',
                    
                  )}>{type === 'email' ? t('Pages.login.registerForm_email') : t('Pages.login.registerForm_phone')}
                </span>
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

            <EmailPhone type={isUseEmail ? 'email' : 'phone'} value={{ email: '', phone: '' }} />

          </Form.Item>

          <Form.Item name="code" label={t('Pages.login.registerForm_verificationCode')}
            rules={[{ required: true, message: t('Components.VerificationCode.captcha.verify1') }]}
          >
            <VerificationCode
              value={getFieldValue('code')}
              onChange={(value: string) => setFieldsValue({ code: value })}
              isAcceptCode={isAcceptCode}
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
                  Email: email,
                  Mobile: phone,
                  // EmailOrMobile: phone,
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
        </>
      )}
    </Form>
  )
}



export default addRouterApi(checkForm)