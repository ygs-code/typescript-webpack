import { Radio, message, Input, Button } from "antd";
import React, { Component, useState } from "react";
// import { DatePicker, Space } from 'antd';
import ModalForm from '@/components/ModalForm';
import dayjs from 'dayjs';
import { EmailOrSmsSendCode, updateAccountAuthInfo, Login, GetAccountInfo } from '@/apis';
import Token from "@/apis/request/token";
import './index.scss';
import EmailPhone from '@/components/EmailPhone';
import VerificationCode from '@/components/VerificationCode';
import { init } from "@rematch/core";
import { useTranslation } from "react-i18next";


export default (props) => {
    const {
        onChange,
        value = {},
        disabled,
        action
    } = props
    const [open, setOpen] = useState(false)
    const [isAcceptCode, setIsAcceptCode] = useState(false)

    const {
        phone,
        region: {
            alpha2Code,
            callingCodes
        } = {}
    } = value

    const { t } = useTranslation()


    console.log('value222===', value)



    return (
        <div>
            <ModalForm
                modalProps={{
                    title: t("Pages.PersonalInfoWrite.MobilePhoneVerification") // 手机验证
                }}
                onOk={async (values: any) => {
                    const {
                        phone: {
                            phone,
                            region: {
                                alpha2Code,
                                callingCodes,
                                commonName,
                                nativeName,
                            }
                        },
                        code
                    } = values
                    await updateAccountAuthInfo({
                        RegionDic: {
                            nativeName,
                            commonName,
                            alpha2Code,
                            callingCodes
                        },
                        Mobile: phone,
                        code
                    })
                    message.success(t("Pages.PersonalInfoWrite.OperationSuccessful")) // "操作成功"
                    onChange && onChange(values.phone)
                    setOpen(false)
                }}

                onCancel={() => {
                    setOpen(false)
                }}
                open={open}
                getInitialValues={(_this: any) => {



                    // console.log('status========', status)

                    return {
                        phone: value
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
                            label: t("Pages.PersonalInfoWrite.PhoneNumber"), //手机号码
                            name: "phone",
                            type: "input",
                            props: {
                                readOnly,
                            },
                            itemProps: {
                                // initialValue: value,
                                onChange: ({
                                    target: {
                                        value: v
                                    }
                                }: React.ChangeEvent<HTMLInputElement>) => {




                                    setIsAcceptCode(!!v)
                                }
                            },
                            render: ({
                                value,
                                onChange
                            }: {
                                value: any,
                                onChange: Function
                            }) => {
                                return <EmailPhone
                                    type={'phone'}
                                    value={value}
                                    onChange={(v) => {


                                        onChange(v)
                                    }}
                                />
                            },
                            rules: [
                                {
                                    required: true,
                                    validator: (_: any, $value = {}) => {

                                        const {
                                            phone,
                                            region: {
                                                value
                                            } = {}
                                        } = $value

                                        if (!value) {
                                            return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseSelectRegion")));  // "请选择地区"

                                        }

                                        if (!phone) {
                                            return Promise.reject(new Error(t("Pages.PersonalInfoWrite.PleaseEnterMobilePhoneNumber"))); // "请输入手机号码"

                                        }


                                        return Promise.resolve();
                                    }
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
                                            phone: {
                                                phone,
                                                region: {
                                                    alpha2Code,
                                                    callingCodes,
                                                    commonName,
                                                    nativeName,
                                                },

                                            } } = getFieldsValue('phone') || {}

                                        let parameter = {
                                            RegionDic: {
                                                nativeName,
                                                commonName,
                                                alpha2Code,
                                                callingCodes
                                            },
                                            // Email: email,
                                            Mobile: phone,
                                            // EmailOrMobile: phone,
                                        }


                                        // let parameter = {
                                        //     Email: phone,
                                        // }



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
                action == 'details' ? <div>
                    {callingCodes}   {phone}
                    <Button onClick={() => {
                    setOpen(true)
                }} style={{
                        marginLeft: '10px'
                    }}>{t("Pages.PersonalInfoWrite.ModifyPhoneMumber")}</Button> 
                    {/* 修改手机号码 */}
                </div> : <div
                    onClick={() => {
                        setOpen(true)
                    }}
                >
                    <EmailPhone
                        readOnly={true}
                        disabled={disabled}
                        type={'phone'}
                        value={value}
                        onChange={(v) => {
                            onChange(v)
                        }}
                    />

                </div>

            }
        </div>
    )
}
