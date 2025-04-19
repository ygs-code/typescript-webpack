
import { useEffect, useState } from 'react';
import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Flex, Select, Row, Col, Mentions, Modal, Spin, message } from 'antd';
import Viewer from 'react-viewer';
import *  as   apis from "@/apis";
import Token from "@/apis/request/token";
import { codeReg } from "@/utils";
import "./index.scss";


import {
    RedoOutlined
} from '@ant-design/icons';





type FieldType = {
    Captcha?: string;
};

type PropsType = {
    onSubmit?: Function;
    isAcceptCode?: boolean;
    type?: keyof typeof apis;
};



interface InputCodeProps {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: keyof typeof apis;
    value?: string;
}

export const InputCode: React.FC<InputCodeProps> = (props: InputCodeProps) => {
    const { t } = useTranslation()
    const {
        onChange,
        value,
        type = 'getGenRegCaptcha'
    } = props
    const [imgSrc, setImgSrc] = useState<string | null>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [previewImage, setPreviewImage] = React.useState<{
        visible: boolean;
        urls: { src: string; alt: string }[];
    }>({
        visible: false,
        urls: [],
    });

    const onMaskClick = () => setPreviewImage({ ...previewImage, visible: false })

    const init = async () => {  // 初始化   
        setLoading(true)



        // getGenRegCaptcha  ,GenAuthCaptcha

        apis[type]().then((response: any) => {
            const {
                svg,
                token
            } = response.data;
            //  将SVG字符串转换为Buffer对象，然后转换为Base64编码
            setImgSrc(`data:image/svg+xml;base64,${btoa(svg)}`)
            Token.set(token)
            setLoading(false)
        }).catch((error) => {
            console.log('error==', error)
            setLoading(false)
        })
    }

    useEffect(() => {
        init()
    }, [])


    return (

        <div className='verification-code'>

            <Viewer
                zIndex={9999}
                defaultSize={{ width: 81 * 5, height: 38 * 5, }}
                visible={previewImage.visible}
                onMaskClick={onMaskClick}
                onClose={() => {
                    setPreviewImage({
                        visible: false,
                        urls: [],
                    });
                }}
                images={previewImage.urls}
            />

            <div className='verification-code-left-box'>
                <Input onChange={onChange} value={value} />
            </div>

            <div
                style={{
                    width: '110px',
                    height: '30px'
                }}
            >
                <Spin tip={t("Common.loading")} size="small"

                    spinning={loading}>
                    <div className='verification-code-right-box' >
                        <div className='verification-code-overlay'
                        >

                            <RedoOutlined

                                className='verification-code-load'

                                onClick={init}

                            />
                            <i

                                onClick={() => {
                                    setPreviewImage({
                                        visible: true,
                                        urls: [{ src: imgSrc, alt: '验证码' }],
                                    });
                                }}
                                aria-label="图标: eye-o"
                                className="verification-code-view">
                                <svg

                                    viewBox="64 64 896 896"
                                    focusable="false"

                                    data-icon="eye"
                                    width="2em"
                                    height="2em"
                                    fill="currentColor"
                                    aria-hidden="true">
                                    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                                </svg>
                            </i>
                        </div>



                        {
                            imgSrc ? <img
                                className='cursor-pointer'
                                onClick={init}
                                src={imgSrc || ''} alt="" /> : null
                        }
                    </div>
                </Spin>
            </div>
        </div>
    )
}



const VerifyCode: React.FC<PropsType> = (props: PropsType) => {
    const { t } = useTranslation()
    const [imgSrc, setImgSrc] = useState<string | null>('');
    const { onSubmit = () => { }, type = 'getGenRegCaptcha' } = props
    const [loading, setLoading] = useState(false);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true)
        await onSubmit(values).catch((error: any) => {
            setLoading(false)
        })
        setLoading(false)
    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    // const init = async () => {  // 初始化   
    //     apis[type]().then((response: any) => {
    //         const {
    //             svg,
    //             token
    //         } = response.data;
    //         //  将SVG字符串转换为Buffer对象，然后转换为Base64编码
    //         // const base64String = Buffer.from(svg).toString('base64');
    //         setImgSrc(`data:image/svg+xml;base64,${btoa(svg)}`)
    //         Token.set(token)
    //     }).catch((error) => {
    //         console.log('error==', error)
    //     })
    // }
    // useEffect(() => {
    //     init()
    // }, [])


    return (

        <Form
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {/* <Form.Item<FieldType>
                label={
                    t('graph.label')
                }
            >
                <Spin tip="Loading" size="small" spinning={!imgSrc}>
                    <img
                       onClick={init}
                        style={{
                            width: '120px',

                        }}
                        src={imgSrc || ''} alt="" />
                </Spin>
            </Form.Item> */}
            <Form.Item<FieldType>
                label={t('Pages.login.registerForm_verificationCode')}
                name="Captcha"
                rules={[
                    // {
                    //     required: true,
                    //     message: t('captcha.verify'),
                    // },
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
                <InputCode type={type} />
            </Form.Item>
            <Button
                loading={loading}
                style={{ margin: '0 auto', display: 'block' }}
                className='verification-code-mx-auto block'
                type="primary" htmlType="submit">
                {t('Common.confirm')}
            </Button>
        </Form>

    )
}






//

export default ({ type, value, onChange = () => { }, isAcceptCode, onSubmit = () => { } }: { type: string; value: string; onChange: Function; isAcceptCode: boolean; onSubmit: Function }) => {
    // 前面的key
    const { t } = useTranslation()

    // 存储倒计时状态
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);


    // 开始倒计时
    const startCountdown = () => {
        let seconds = 60 * 2;
        setCountdown(seconds);
        const intervalId = setInterval(() => {
            if (seconds > 0) {
                seconds--;
                setCountdown(seconds);
            } else {
                clearInterval(intervalId);
                setCountdown(0);
            }
        }, 1000);
    };
    // 发送验证码
    const sendVerifyCode = () => {
        if (countdown === 0) {
            startCountdown();
        }
    };



    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => { }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <div className='verification-code'>
            <Modal destroyOnClose title={t('Pages.login.registerForm_verificationCode')} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                footer={null}
            >
                <VerifyCode
                    type={type}
                    onSubmit={async (values: any) => {
                        setLoading(true)
                        // 验证码
                        await onSubmit(values)



                        message.success(t('Common.sendSuccess'))
                        sendVerifyCode()
                        // 发送验证码
                        setIsModalOpen(false)
                    }} />
            </Modal>

            <Row gutter={8}>
                <Col span={10}>
                    <Input
                        value={value}
                        onChange={(event) => {
                            const {
                                value
                            } = event.target
                            onChange(value)
                        }} />
                </Col>
                <Col span={8}>
                    <Button

                        disabled={countdown > 0 || !isAcceptCode} onClick={() => {

                            setIsModalOpen(true)
                        }}>
                        {countdown > 0 ? `${countdown}(s)` : t('Pages.login.registerForm_receiveCode')}
                    </Button>
                </Col>
            </Row>
        </div>
    )
}





