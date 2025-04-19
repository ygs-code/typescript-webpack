import "./index.scss";
import { FC, useState } from "react"
import DetailsForm from "src/components/DetailsForm"
import { useTranslation } from 'react-i18next';
import { FormItemProps, SlotComponentProps } from '@/types/detailsForm'
import { Form, message, Segmented } from 'antd';
import { createMT5Account } from "src/apis/page/account";

import TopTitle from "@/components/TopTitle"

interface CreateAccount {
    switchIsCreateAcc: () => void
    handleAddAcc: () => void
}

// interface AccInfoItem {
//     amountAvailable: number;
//     tradingAccount: string;
//     serverID: string;
//     accTpye: string;
//     amountList: string[]
//   }


const CreateAccount: FC<CreateAccount> = ({
    switchIsCreateAcc = () => {},
    handleAddAcc = () => {}
}) => {

    const { t } = useTranslation()
    const [messageApi, contextHolder] = message.useMessage()
    const [loading, setLoading] = useState(false)
    // 0模拟demo 1真实standard 2pro
    const groupArr = ['Demo', 'Standard', 'Pro']
    const [group, setGroup] = useState('1') // 0 模拟账户 1真实账户
    const segmentedPorps = {
        disabled: loading,
        style: { maxWidth: '482px', border: '1px solid #D5D8DC', background: '#F5F7FA' },
        block: true,
        options: [
            { label: t("Pages.Account.RealAccount"), value: '1' }, //真实账户
            { label: t("Pages.Account.DemoAccount"), value: '0' }, //模拟账户
        ],
        value: group,
        onChange: (value: string) => setGroup(value)
    }

    const passwordValidator = (rule: any, value: string) => {
        if (!value) {
            return rule.field === "investorPassword" ? Promise.resolve() : Promise.reject(new Error(t("Validators.PleaseEnterPassword")))
        }
        if (!/[A-Z]/.test(value)) {
            return Promise.reject(new Error(t("Validators.NeedUppercaseMsg")));
        }
        if (!/[a-z]/.test(value)) {
            return Promise.reject(new Error(t("Validators.NeedLowercaseMsg")));
        }
        if (!/[0-9]/.test(value)) {
            return Promise.reject(new Error(t("Validators.NeedOneNumMsg")));
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            return Promise.reject(new Error(t("Validators.NeedOneSpecialMsg")));
        }
        if (value.length < 8 || value.length > 15) {
            return Promise.reject(new Error(t("Validators.8to15Msg")));
        }
        return Promise.resolve();
    };

    const [form] = Form.useForm()

    const submitForm = async (values: any) => {
        try {
            const params = { ...values, group: groupArr[Number(group)] }
            setLoading(true)
            const res = await createMT5Account(params)
            if (res.code === 200) {
                form.resetFields()
                messageApi.open({ type: 'success', content: t("Pages.Account.CreateTradingAccountSuccess") })//开设成功
                switchIsCreateAcc()
                handleAddAcc()
            }
            setLoading(false)
        }
        catch {}
        finally { setLoading(false) }
    }

    // 提交成功后的回调
    const onFinish = (values: any) => {
        console.log(values, 'onFinishonFinishonFinish');
        submitForm(values)
    };


    const [initialValues, setInitialValues] = useState({
        currencyUnit: 'USD',
        accountType: '0',   // 账户类型 '0' 标准账户 '1'真实账户
        leverage: null,
        initialCapital: null,
        masterPassword: '',
        investorPassword: ''
    })
    const formProps = {
        name: 'formName',
        disabled: false,
        onFinish,
        form, // 确保传递 form 实例
        labelCol: { span: 12 },
        wrapperCol: { span: 24 },
        style: { maxWidth: 482 },
        layout: 'vertical', //layout="vertical | horizonta | linline"
        initialValues
    }

    //DetailsForm的控制渲染数据
    const formItemPropData: [FormItemProps | FormItemProps[], SlotComponentProps][] = [
        [
            {
                name: 'currencyUnit',
                label: t("Pages.Account.CurrencyUnit"),    // 货币单位
                rules: [],
            },
            {
                type: 'Input',
                props: {
                    disabled: true,
                    // variant: "borderless",
                    // style: { background: "#F5F7FA" },
                },
            },
        ],
        [
            {
                name: 'accountType',
                label: t("Pages.Account.AccountType"), // 账户类型
                rules: [
                    { required: true, message: t("Pages.Account.PleaseSelect") },
                ],
            },
            {
                type: 'Select',
                props: {
                    placeholder: t("Pages.Account.PleaseSelect"),
                    disabled: true,
                    options: [
                        { label: '标准账户', value: '0' },
                        { label: 'xx账户', value: '1' }
                    ]
                },
            },
        ],
        [
            {
                name: 'leverage',
                label: t("Pages.Account.LeverageSize"), // 杠杆大小
                rules: [
                    { required: true, message: t("Pages.Account.PleaseSelect") },
                ],
            },
            {
                type: 'Select',
                props: {
                    placeholder: t("Pages.Account.PleaseSelect"),
                    options: [
                        { label: '1: 20', value: '20' },
                        { label: '1: 50', value: '50' },
                        { label: '1: 100', value: '100' },
                        { label: '1: 200', value: '200' },
                        { label: '1: 300', value: '300' },
                    ],
                },
            },
        ],
        [
            {
                name: 'initialCapital',
                label: t("Pages.Account.InitialCapital"), // 初始资金
                rules: (() => group === '0' ? [{ required: true, message: t("Pages.Account.PleaseSelect") }] : [])(),
                hidden: group !== '0',
            },
            {
                type: 'Select',
                props: {
                    placeholder: t("Pages.Account.PleaseSelect"),
                    options: [
                        { label: '5000', value: '5000' },
                        { label: '10000', value: '10000' },
                        { label: '20000', value: '20000' },
                        { label: '50000', value: '50000' },
                    ],
                },
            },
        ],
        [
            {
                name: 'masterPassword',
                label: t("Pages.Account.MasterPasswordSettings"), // 主密码设置
                //函数动态渲染rules
                rules: [{ required: true, validator: passwordValidator }],
            },
            {
                type: 'PasswordInput',
                props: {
                    placeholder: t("Validators.PleaseEnterPassword"),
                },
                showSpan: true,
                spanContent: t("Pages.Account.RequiredMsg") //8-15个字符,需包含至少一个大写和小写字母、数字、特殊字符
            },
        ],
        [
            {
                name: 'investorPassword',
                label: t("Pages.Account.Read-onlyPasswordSetting"), // 只读密码设置
                rules: (() => group === '1' ? [{ required: false, validator: passwordValidator }] : [])(),
                hidden: group !== '1',
            },
            {
                type: 'PasswordInput',
                props: {
                    placeholder: t("Validators.PleaseEnterPassword"),
                },
                showSpan: true,
                spanContent: t("Pages.Account.RequiredMsg") //8-15个字符,需包含至少一个大写和小写字母、数字、特殊字符
            },
        ],
        [
            [
                {
                    name: 'Button1', //占位
                },
                {
                    name: 'Button2', //占位
                },
            ],
            {
                type: 'MultipleButtons',
                options: [
                    {
                        props: {
                            type: 'primary',
                            htmlType: 'submit',
                            style: {
                                width: '160px',
                                height: '40px',
                                borderRadius: '4px',
                            },
                        },
                        content: t("Pages.Account.Submit"),  // 提交
                    },
                    {
                        props: {
                            htmlType: 'button',
                            style: {
                                width: '160px',
                                height: '40px',
                                borderRadius: '4px',
                                marginLeft: '16px',
                            },
                            onClick: () => {
                                switchIsCreateAcc()
                                form.resetFields()
                            }
                        },
                        content: t("Pages.Account.Return"), // 返回
                    }
                ],
            },
        ],


    ]




    return (
        <div className="create-account-page">
            {contextHolder}
            <TopTitle
                isShowHr={true}
                title={t("Pages.Account.OpenNewAccount")}
            />
            <div className="create-account-box">
                <Segmented
                    size="large"
                    {...segmentedPorps}

                />
                <div className="create-account-form-box">
                    <DetailsForm
                        formItemPropData={formItemPropData}
                        formProps={formProps}
                        formLoading={loading}
                        
                    />
                </div>
            </div>

        </div>
    )
}

export default CreateAccount