'use client';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import type { FormProps } from 'antd';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Flex,
  Select,
  Row,
  Col,
  Mentions,
  message,
} from 'antd';
import EmailPhone from '@/components/EmailPhone';
import VerificationCode from '@/components/VerificationCode';
import { addRouterApi, Link } from 'src/router';
import { emailReg, passwordReg, getSearchParams } from '@/utils';
import { EmailOrSmsSendCode, Register } from '@/apis';
import Token from 'src/apis/request/token';
import './index.scss';

// 引入HOC高阶函数 withTranslation 和 i18n 的ts类型定义 WithTranslation
import {
  withTranslation,
  WithTranslation,
  useTranslation,
} from 'react-i18next';

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
  routePaths: { logIn: string };
  formName: string;
  pushRoute: (str: string) => void;
  switchMcOpen: () => void;
}

const LoginForm = (props: LoginFormProps) => {
  const { formName, pushRoute, routePaths, switchMcOpen } = props;

  const { t } = useTranslation();
  const [isAcceptCode, setIsAcceptCode] = useState(false);
  const [isUseEmail, setIsUseEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  console.log('props==', props);
  console.log('getSearchParams==', getSearchParams('code'));

  useEffect(() => { }, []);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = async (
    info
  ) => {
    console.log('info:', info);

    const {
      errorFields = [],
      values: {
        password,
        code,
        emailPhone: {
          email,
          phone,
          region: { alpha2Code, callingCodes, commonName, nativeName } = {},
        } = {},
        inviteCode = '',
      } = {},
    } = info;
    if (errorFields.length) {
      return false;
    }
    setLoading(true);

    let data = await Register({
      Email: email,
      Mobile: phone,
      RegionDic: {
        nativeName,
        commonName,
        alpha2Code,
        callingCodes,
      },

      Password: password,
      Code: code,
      InviteCode: inviteCode,
    })
      .then(() => {
        // message.success(t('Pages.login.registeredSuccessfully'));
        // setTimeout(() => {
        //   pushRoute(routePaths.logIn);
        // }, 1000);
        switchMcOpen()

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    console.log('Failed:', info);
  };

  useEffect(() => { }, []);

  const [form] = Form.useForm();
  const { getFieldsValue, getFieldValue, validateFields, setFieldsValue } =
    form;
  const onEmailOrPhoneChange = (value: boolean) => {
    setFieldsValue({
      emailPhone: undefined,
    });
    setIsUseEmail(value);
  };

  const code = getSearchParams('code');

  return (
    <div className='register-form'>
      <Form
        name={formName}
        form={form}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ minWidth: 300, margin: 'auto', maxWidth: 360 }}
        size="large"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          inviteCode: code,
        }}
      // autoComplete="off"
      // requiredMark={true}
      >
        {/* 注册 */}
        {
          <>
            <Form.Item
              name="emailPhone"
              label={
                <div className="text-[#49505E]">
                  <span
                    onClick={() => onEmailOrPhoneChange(true)}
                    className={cn(
                      'text-[#49505E] hover:text-[#49505E]',
                      'login-form-account',

                      'login-form-account',
                      isUseEmail ? 'login-form-account-active' : ''
                    )}>
                    {t('Pages.login.registerForm_email')}
                  </span>
                  <span className="login-form-line">|</span>
                  <span
                    onClick={() => onEmailOrPhoneChange(false)}
                    className={cn(
                      'text-[#49505E] hover:text-[#49505E]',
                      'login-form-account',
                      'login-form-account',
                      !isUseEmail ? 'login-form-account-active' : ''
                    )}>
                    {t('Pages.login.registerForm_phone')}
                  </span>
                </div>
              }
              rules={[
                {
                  required: true,
                  validator: (rule, value = {}) => {
                    const { email, phone, region } = value;
                    if (isUseEmail) {
                      if (!email) {
                        return Promise.reject(
                          t('Components.EmailPhone.email.verify1')
                        );
                      }

                      if (!email.match(emailReg)) {
                        return Promise.reject(
                          t('Components.EmailPhone.email.verify2')
                        );
                      }
                    } else {
                      if (!region) {
                        return Promise.reject(
                          t('Components.EmailPhone.phone.verify3')
                        );
                      }

                      if (!phone) {
                        return Promise.reject(
                          t('Components.EmailPhone.phone.verify1')
                        );
                      }
                    }
                    setIsAcceptCode(true);
                    return Promise.resolve();
                  },
                },
              ]}>
              <EmailPhone
                type={isUseEmail ? 'email' : 'phone'}
                value={{ email: '', phone: '' }}
              />
            </Form.Item>

            <Form.Item
              name="code"
              label={t('Pages.login.registerForm_verificationCode')}
              rules={[
                {
                  required: true,
                  message: t('Components.VerificationCode.captcha.verify1'),
                },
              ]}>
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
                    } = {},
                  } = getFieldValue('emailPhone') || {};

                  console.log('phone==', getFieldValue('emailPhone'));

                  let parameter = {
                    RegionDic: {
                      nativeName,
                      commonName,
                      alpha2Code,
                      callingCodes,
                    },
                    Email: email,
                    Mobile: phone,
                    // EmailOrMobile: phone,
                  };
                  // 更新token
                  let { data = '' } = await EmailOrSmsSendCode({
                    ...parameter,
                    ...v,
                  });
                  Token.set(data);
                  return data;
                }}
              />
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
                  validator: (rule, value = '') => {
                    const confirmPassword = getFieldValue('confirmPassword');
                    if (value.trim() === '') {
                      return Promise.reject(t('Pages.login.inputPassword'));
                    }
                    if (!value.match(passwordReg)) {
                      return Promise.reject(t('Pages.login.err_msg_pwd'));
                    }
                    // if (confirmPassword && confirmPassword !== value) {
                    //   return Promise.reject(t('passwordInconsistency'))
                    // }

                    validateFields(['confirmPassword']);
                    return Promise.resolve();
                  },
                },
              ]}>
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
                  validator: (rule, value = '') => {
                    const password = getFieldValue('password');
                    if (value.trim() === '') {
                      return Promise.reject(t('Pages.login.inputPassword'));
                    }
                    if (!value.match(passwordReg)) {
                      return Promise.reject(t('Pages.login.err_msg_pwd'));
                    }
                    if (password && password !== value) {
                      return Promise.reject(
                        t('Pages.login.passwordInconsistency')
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              <Input.Password />
            </Form.Item>

            {/* extra="We must make sure that your are a human." */}
            <Form.Item
              name="inviteCode"
              label={t('Pages.login.registerForm_inviteCode')}
              labelCol={{ span: 24 }}>
              <Input />
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(t('Pages.login.checkClause')),
                },
              ]}>
              <Checkbox>
                {t('Pages.login.registerForm_desc_1')}

                <a
                  onClick={() => {
                    window.open(
                      process.env.PUBLIC_WEBSITE_INTRO_DOMAIN_NAME + '/legal',
                      '_blank'
                    );
                  }}
                  target="_blank"
                  className="theme-color"
                  style={{
                    margin: '0 5px',
                  }}>
                  {t('Pages.login.registerForm_desc_2')}
                </a>

                {t('Pages.login.registerForm_desc_3')}
              </Checkbox>
            </Form.Item>

            <Form.Item label={null} labelCol={{ span: 0 }}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                block
                className="mb-1">
                {t('Pages.login.loginForm_signup')}
              </Button>

              <span className="span-cursor">
                {' '}
                {t('Pages.login.or')}
                {/* <Link href="/login" > */}
                <span
                  onClick={() => {
                    pushRoute(routePaths.logIn);
                  }}
                  className="theme-color"
                  style={{
                    marginLeft: '5px',
                  }}>
                  {t('Pages.login.loginForm_button')}
                </span>
                {/* </Link> */}
              </span>
            </Form.Item>
          </>
        }
      </Form>
    </div>
  );
};

export default addRouterApi(LoginForm);
