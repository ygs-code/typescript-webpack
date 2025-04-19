import "./index.scss";
import { Button, Input, Modal, Space } from 'antd';
import type { FormProps } from 'antd';
import { FC, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import FormComp from './Form';
import { Form } from 'antd';

import { updateAccountAuthInfo } from "src/apis/page/personalInfoWrite"
import Token from "src/apis/request/token";


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

interface CheckEmailAndMobileProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: string;
  onSubmit: (type: string, values: { emailPhone: { email?: string; mobile?: string; }, code: string }) => void;
}

const CheckEmailAndMobile: FC<CheckEmailAndMobileProps> = ({
  isOpen = false,
  setIsOpen = () => { },
  type = 'mobile',
  onSubmit = () => {}
}) => {
  const { t } = useTranslation()

  const switchOpen = () => setIsOpen(!isOpen);

  const [form] = Form.useForm();

  const onOk = () => {
    //请求更新
    const values = form.getFieldsValue()
    const datas = { ...values, ...values.emailPhone }
    //更新账号信息
    updateAccountAuthInfo(datas).then(res => {
      //传入新的token
      res.data && Token.set(res.data)
      //传给父组件
      onSubmit(type, datas)
      switchOpen()
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      <Modal

        title={type === 'email' ? t("Pages.PersonalInfoWrite.BindEmail") : t("Pages.PersonalInfoWrite.BindEmail")} //绑定 电子邮箱 手机号码
        open={isOpen}
        onOk={onOk}
        onCancel={switchOpen}
        okText={t("Pages.PersonalInfoWrite.Confirm")} //确认
        cancelText={t("Pages.PersonalInfoWrite.Cancel")} //取消
      >
        <FormComp type={type} form={form} />
      </Modal>
    </>
  )
}


export default CheckEmailAndMobile