import { Radio, message, Input, Button } from "antd";
import React, { Component, useState } from "react";
import { DatePicker, Space } from 'antd';
import ModalForm from '@/components/ModalForm';
import dayjs from 'dayjs';
import { EmailOrSmsSendCode, updateAccountAuthInfo, Login, } from '@/apis';
import Token from "@/apis/request/token";
import './index.scss';

import VerificationCode from '@/components/VerificationCode';
import { useTranslation } from "react-i18next";

export default (props) => {
    const {
        onChange,
        value,
        disabled,
        readOnly,
        action
    } = props
    const [open, setOpen] = useState(false)
    const [isAcceptCode, setIsAcceptCode] = useState(false)

    console.log('disabled===========', disabled)
    const { t } = useTranslation()

    console.log(t, t("Pages.PersonalInfoWrite.EmailVerification"))

    return (
        <div  >
            <ModalForm
                modalProps={{
                    title: t("Pages.PersonalInfoWrite.EmailVerification") //邮箱验证
                }}
                onOk={async (values: any) => {
                    await updateAccountAuthInfo(values)
                    message.success(t("Pages.PersonalInfoWrite.OperationSuccessful")) // "操作成功"
                    onChange && onChange(values.email)
                    setOpen(false)
                }}

                onCancel={() => {
                    setOpen(false)
                }}
                open={open}
                getInitialValues={(_this: any) => {



                    // console.log('status========', status)

                    return {
                        email: value
                    }
                }}
                getFields={(_this: any) => {
                    const {
                        getFieldValue = () => { },
                        getFieldsValue = () => { }
                    } = _this.form || {};

                    let readOnly = false
                    return [
                        {
                            label: t("Pages.PersonalInfoWrite.Email"), // "邮箱"
                            name: "email",
                            type: "input",
                            props: {
                                readOnly,
                            },
                            itemProps: {
                                onChange: ({
                                    target: {
                                        value: v
                                    }
                                }: React.ChangeEvent<HTMLInputElement>) => {




                                    setIsAcceptCode(!!v)
                                }
                            },
                            rules: [
                                {
                                    required: true,
                                    message: t("Pages.PersonalInfoWrite.Required")  // "必填"
                                }
                            ]
                        },

                        {
                            label: t("Components.VerificationCode.captcha.label"), // "验证码"
                            name: "code",
                            props: {
                                readOnly,
                            },
                            // itemProps: { initialValue: gwRespCode, },
                            type: "input",
                            render: (props) => {
                                const {
                                    value,
                                    onChange
                                } = props
                                return <VerificationCode
                                    type="GenAuthCaptcha"
                                    value={value}
                                    onChange={onChange}
                                    isAcceptCode={isAcceptCode}
                                    onSubmit={async (v: any) => {



                                        const {
                                            email,
                                        } = getFieldsValue('email') || {}

                                        let parameter = {
                                            Email: email,
                                        }
                                        // 更新token
                                        let { data = '' } = await EmailOrSmsSendCode({
                                            ...parameter,
                                            ...v,
                                        })
                                        Token.set(data)

                                        return data

                                    }} />
                            },
                            rules: [
                                {
                                    required: true,
                                    message: t("Pages.PersonalInfoWrite.Required")  // "必填"
                                }
                            ]
                        },

                    ]
                }}

            />

            {
                action == 'details' ? <div onClick={() => {
                    setOpen(true)
                }}>
                    {value}   <Button style={{
                        marginLeft: '10px'
                        //修改邮箱
                    }}>{t("Pages.PersonalInfoWrite.ModifyEmail")}</Button>
                </div> : <Input
                    disabled={disabled}
                    value={value}
                    onClick={() => {
                        setOpen(true)
                    }} readOnly />
            }

        </div>
    )
}
