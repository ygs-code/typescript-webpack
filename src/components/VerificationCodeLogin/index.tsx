import { checkEmail, checkPhone } from '@/utils';
import { Button, Checkbox, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.scss';
import Captcha from '../Captcha';
import { emailLogin, emailSendCode } from '@/apis';
import Token from '@/apis/request/token';
import { addRouterApi } from 'src/router';
import { mapRedux } from '@/redux';
import { getLoginInfo, setLoginInfo } from '@/storage/loginInfo';

interface LoginProps {
  type: 'email' | 'phone';
  size?: 'small' | 'middle' | 'large';
  placeholder?: string;
  prefix?: React.ReactNode;
  pushRoute?: (path: string | Object) => void;
  routePaths?: {
    home: string;
    register: string;
  };
}

const VerificationCodeLogin: React.FC<LoginProps> = (props) => {
  const { type, size, placeholder, prefix, pushRoute, routePaths } = props;
  const [form] = Form.useForm();
  const [sendEmailLoading, setSendEmailLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loginLoading, setLoginLoading] = useState(false);

  // 记住账号
  useEffect(() => {
    const loginInfo = getLoginInfo();
    if (loginInfo) {
      if (loginInfo.loginType !== type) {
        return;
      }
      form.setFieldsValue({
        emailOrPhone: loginInfo.userId,
        isRemember: true,
      });
    }
  }, [form]);

  // 输入框验证提示
  const showMessage = (type: string) => {
    switch (type) {
      case 'email':
        return '请输入邮箱';
      case 'phone':
        return '请输入手机号';
      default:
        return '请输入用户名或手机号或邮箱';
    }
  };

  // 验证邮箱或手机号
  const validateEmailOrPhone = (rule: any, value: any) => {
    if (type === 'phone' && checkPhone(value)) {
      return Promise.resolve();
    }
    if (type === 'email' && checkEmail(value)) {
      return Promise.resolve();
    }
    return Promise.reject('格式不正确请重新输入');
  };

  // 获取邮箱验证码
  const handleGetCodeClick = () => {
    const email = form.getFieldValue('emailOrPhone');
    const captcha = form.getFieldValue('captcha');
    setSendEmailLoading(true);
    const params = { Login: email };
    emailSendCode(params, captcha)
      .then((res) => {
        setSendEmailLoading(false);
        message.success('验证码发送成功');
        Token.set(res.data);
        setCountdown(10);
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(interval);
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch(() => setSendEmailLoading(false))
  };

  // 登录
  const onFinish = (values: any) => {
    setLoginLoading(true);
    if (values.isRemember) {
      setLoginInfo({
        loginType: type,
        userId: values.emailOrPhone,
      });
    }
    try {
      emailLogin(values.emailCode).then((res) => {
        setLoginLoading(false);
        message.success('登录成功');
        // const { accessMenuList, accessActionList } = res.data;
        setLoginInfo({
          loginType: type,
          userId: values.emailOrPhone,
        });
        Token.set(res.data.authorization);
        pushRoute(
          {
            path: routePaths.home,
            params: {}, // 地址传参
            // query: {
            //   age: 18,
            // }, // get 传参
          }
          // routePaths.home
        );
      });
    } catch (error) {}
  };

  return (
    <Form form={form} onFinish={onFinish} style={{ width: '500px' }}>
      <Form.Item
        name="emailOrPhone"
        validateFirst={true}
        rules={[
          {
            required: true,
            message: showMessage(type),
          },
          {
            validator: validateEmailOrPhone,
          },
        ]}>
        <Input
          size={size}
          placeholder={placeholder}
          prefix={prefix}
          allowClear
        />
      </Form.Item>
      <Form.Item name="captcha">
        <div className="flex-center">
          <Input
            size={size}
            placeholder="请输入图形验证码"
            allowClear
            style={{ marginRight: '8px' }}
          />
          <Captcha />
        </div>
      </Form.Item>
      <Form.Item name="emailCode">
        <div className="flex-center">
          <Input
            size={size}
            placeholder="请输入邮箱验证码"
            allowClear
            style={{ marginRight: '8px' }}
          />
          <Button
            size={size}
            onClick={handleGetCodeClick}
            loading={sendEmailLoading}
            disabled={countdown > 0}>
            {countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码'}
          </Button>
        </div>
      </Form.Item>
      <Form.Item name="isRemember" valuePropName="checked" initialValue={false}>
        <Checkbox>记住账号</Checkbox>
      </Form.Item>
      <Form.Item>
        <Button className="login-button" type="primary" htmlType="submit" loading={loginLoading} >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default mapRedux()(addRouterApi(VerificationCodeLogin));
