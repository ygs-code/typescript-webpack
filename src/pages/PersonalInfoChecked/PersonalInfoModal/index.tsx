import "./index.scss";
import { Button, Modal, Space } from 'antd';
import DetailsForm from "src/components/DetailsForm";

import { FC, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import { Form } from 'antd';

import { FormItemProps, SlotComponentProps } from '@/types/detailsForm'

interface PersonalInfoModalProps {
  formInfoData: {
    chineseSurname?: string;
    chineseName?: string;
    englishSurname?: string;
    englishName?: string;
    [key: string]: any; // Add other properties as needed
  };
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  submitModelForm?: () => void;
}

const PersonalInfoModal: FC<PersonalInfoModalProps> = ({
  formInfoData = {},
  isOpen = false,
  setIsOpen = () => {},
  submitModelForm = () => {}
}) => {

  const { t } = useTranslation()

  useEffect(() => {
    console.log({
      ...formInfoData,
      handleChineseName: formInfoData.familyName + ' ' + formInfoData.givenName,
      handleEnglishName: formInfoData.lastName + ' ' + formInfoData.firstName,
      uploadCard: '已上传'
    }, '已上传已上传已上传已上传已上传已上传已上传已上传已上传已上传');
    
    modelForm.setFieldsValue({
      ...formInfoData,
      handleChineseName: formInfoData.familyName + formInfoData.givenName,
      handleEnglishName: formInfoData.lastName + ' ' + formInfoData.firstName,
      uploadCard: '已上传'
    })
  }, [formInfoData])

  //DetailsForm的控制渲染数据
  const formItemPropData: [FormItemProps, SlotComponentProps][] = [
    [
      {
        name: 'placeOfResidence',
        label: t("Pages.PersonalInfoWrite.PlaceOfResidence"), // 居民身份所在地
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
    [
      {
        name: 'documentType',
        label: t("Pages.PersonalInfoWrite.DocumentType"), // 证件类型
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
    [
      {
        name: 'uploadCard',
        label: t("Pages.PersonalInfoWrite.UploadDocuments"), // 上传证件
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
    [
      {
        name: 'documentNumber',
        label: t("Pages.PersonalInfoWrite.IdNumber"), // 证件号码
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
    [
      {
        name: 'handleChineseName',
        label: t("Pages.PersonalInfoWrite.ChineseName"),// 中文名
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
    [
      {
        name: 'handleEnglishName',
        label: t("Pages.PersonalInfoWrite.EnglishName"), // 英文名
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
    [
      {
        name: 'email',
        label: t("Pages.PersonalInfoWrite.Email"), //电子邮箱
      },
      {
        type: 'Input',
        props: {
          variant: 'borderless',
          readOnly: true,
        },
      },
    ],
    [
      {
        name: 'mobile',
        label: t("Pages.PersonalInfoWrite.PhoneNumber"), //手机号码
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
    [
      {
        name: 'dateOfBirth',
        label: t("Pages.PersonalInfoWrite.DateOfBirth"), //出生日期
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
    [
      {
        name: 'residentialAddress',
        label: t("Pages.PersonalInfoWrite.Address"), // 住址
      },
      {
        type: 'Input',
        props: {
          readOnly: true,
          variant: "borderless",
        },
      },
    ],
  ];
  const switchOpen = () => setIsOpen(!isOpen);
  const submitModel = () => {
    console.log( 'formProps.form.getFieldsValue()');
    submitModelForm()
  }

  const [modelForm] = Form.useForm()
  // 提交成功后的回调
  const onFinish = (values: any) => {
    console.log(values, 'onFinishonFinishonFinish');
  };
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

  let formProps = {
    name: 'checkInfoForm',
    disabled: true,
    onFinish,
    validateMessages,
    form: modelForm, // 确保传递 form 实例
    labelCol: { span: 12 },
    wrapperCol: { span: 24 },
    style: { maxWidth: 482 },
    layout: 'vertical', //layout="vertical | horizonta | linline"
    // initialValues
  }

  return (
    <>
      <Modal
        title={t("Pages.PersonalInfoWrite.Confirm")} //确认
        open={isOpen}
        onOk={submitModel}
        onCancel={switchOpen}
        okText={t("Pages.PersonalInfoWrite.Confirm")} //确认
        cancelText={t("Pages.PersonalInfoWrite.Cancel")} //取消
      >
        <DetailsForm 
          formItemPropData={formItemPropData} 
          formProps={formProps}
        />
      </Modal>
    </>
  )
}


export default PersonalInfoModal