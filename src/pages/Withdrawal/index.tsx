import "./index.scss"
import TopTag from "src/components/TopTag";
import TopTitle from "@/components/TopTitle"
import DetailsForm from "src/components/DetailsForm"
import TermsPart from "src/components/TermsPart"
import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle"
import { postWithdrawal, getCreditCardsWallets, getAmountAvailable } from '@/apis/page/withdrawal';
import { memo, FC, useState, useEffect, useCallback } from "react"
import { mapRedux } from '@/redux';
import { useTranslation, withTranslation } from 'react-i18next'
import { Form, message } from 'antd';

import { FormItemProps, SlotComponentProps } from '@/types/detailsForm'

interface accountOptionsType {
  value?: string;
  label?: string;
  serverID: string;
  amountAvailable: number;
  group: string;
  tradingAccount: string;
  tradingAccountType: string;
}
// 权限控制
const WithdrawalPage: FC = (props: any) => {
  //redux数据
  const accountInfoData = props.state.user.userInfo
  console.log(props, 'accountInfoData');
  
  const [loading, setLoading] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage()
  const { t } = useTranslation()
  const [form] = Form.useForm();
  //账户下选框处理
  // const accountOptions = (accountInfoData.relatedTradingAccounts && accountInfoData.relatedTradingAccounts.length > 0) ?
  // accountInfoData.relatedTradingAccounts.map((item: { serverID: string; tradingAccount: string }) => ({
  //   value: item.tradingAccount,
  //   label: item.tradingAccount,
  //   serverID: item.serverID,
  // })) : []

  const [accountOptions, setAccountOptions] = useState<accountOptionsType []>([])
  //提取至银行卡下拉框
  const [bankOptions, setBankOptions] = useState<any>([])
  //钱包下拉框
  const [walletOptions, setWalletOptions] = useState<any>([])
  //初始数据
  const [initialValues, setInitialValues] = useState({
    serverID: '', //服务器ID
    tradingAccount: '', //账户
    withdrawalAmount: '',  //出金金额 取款
    withdrawalType: '0', // 出金类型 0 BankCard 银行卡  1 Wallet 钱包
    baseCurrency: 'USD', //基础货币
    bankCardNumber: '', //银行卡号
    walletAddr: '', //钱包地址
    amountAvailable: ['0', '0'],  //可取金额
  })
  const { withdrawalType, amountAvailable } = initialValues

  //页面初始化数据
  useEffect(() => {
    const fetchData = async () => {
      //获取银行卡列表
      const [cardsRes, amountRes] = await Promise.all([
        getCreditCardsWallets(),
        getAmountAvailable(),
      ])
      const creditCards = cardsRes.data.creditCards || []
      const bankCards = creditCards.map((item: { abbr: string; bankBranch: string; bankCardNumber: string; bankName: string }) =>
        ({ ...item, label: item.bankName + '*' + item.bankCardNumber.toString().slice(-4), value: item.bankCardNumber }))
      setBankOptions([...bankCards])
      //获取钱包地址列表
      const walletAddrs = cardsRes.data.walletAddrs || []
      const newWalletAddr = walletAddrs.map(
        (item: { currency: string; nodeType: string; paymentChainId: string; title: string; walletAddr: string }) => 
        ({ ...item, label: item.walletAddr, value: item.walletAddr }))
        setWalletOptions([...newWalletAddr])
      // 可用金额
      console.log(amountRes, 'amountResamountResamountRes');
      const accountOptions = amountRes.data.length > 0 && amountRes.data.map((item: { serverID: string; tradingAccount: string }) => ({
        ...item,
        value: item.tradingAccount,
        label: item.tradingAccount,
        serverID: item.serverID
      })).filter((item: accountOptionsType) => item.group === '1') // '0'表示模拟账户，'1'表示真实账户
      setAccountOptions([...accountOptions])
    }
    fetchData()

  }, [])

  //DetailsForm的控制渲染数据
  const formItemPropData: [FormItemProps, SlotComponentProps][] = ([
    [
      {
        name: 'tradingAccount', //账户
        label: t("Pages.Withdrawal.TradingAccount"),
        rules: [
          {
            required: true,
            message: t("Pages.Withdrawal.PleaseSelectAccountType"),
          },
        ],
      },
      {
        type: 'Select',
        props: {
          placeholder: t("Pages.Withdrawal.PleaseSelectAccountType"),
          options: accountOptions,
          onChange: useCallback((value: string, options: { label: string; value: string; serverID: string }) => {
            const accountBalance = String(accountOptions.find((item: { tradingAccount: string }) => item.tradingAccount === value)?.amountAvailable || '0')
            // console.log(accountOptions, 'accountBalanceaccountBalanceaccountBalanceaccountBalance');
            //最多以为小数，分隔后 0.0
            const handleAmountAvailable = accountBalance.includes('.') ? accountBalance.split('.') : [accountBalance, '0']
            setInitialValues((preValues) => ({ ...preValues, tradingAccount: value, serverID: options.serverID, 
              amountAvailable: handleAmountAvailable }))
          }, [accountOptions, amountAvailable])
        },
      },
    ],
    [
      {
        name: 'withdrawalType', //出金类型
        label: t("Pages.Withdrawal.WithdrawalType"),
      },
      {
        type: 'Radio',
        props: {
          placeholder: '',
          options: [
            { value: '0', label: t("Pages.Withdrawal.BankCard") },
            { value: '1', label: t("Pages.Withdrawal.Wallet") },
          ],
          onChange: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            console.log('withdrawalType onchange');
            setInitialValues((preValues) => ({ ...preValues, withdrawalType: e.target.value }))
          }, [initialValues])
        },
      },
    ],
    [
      {
        name: 'bankCardNumber',  //提取至
        label: t("Pages.Withdrawal.ExtractTo"),
        hidden: withdrawalType !== '0',
        rules: [
          { 
            validator: (_, value) => {
              if (withdrawalType === '0' && !value) {
                return Promise.reject(new Error(t("Pages.Withdrawal.PleaseSelect")));
              }
              return Promise.resolve();
            } 
          }
        ],
      },
      {
        type: 'Select',
        props: {
          placeholder: t("Pages.Withdrawal.PleaseSelect"),
          options: bankOptions,
        },
      },
    ],
    [
      {
        name: 'walletAddr',  //钱包地址
        label: t("Pages.Withdrawal.WalletAddress"),
        hidden: withdrawalType !== '1',
        rules: [
          { 
            validator: (_, value) => {
              if (withdrawalType === '1' && !value) {
                return Promise.reject(new Error(t("Pages.Withdrawal.PleaseSelect")));
              }
              return Promise.resolve();
            } 
          }
        ],
      },
      {
        type: 'Select',
        props: {
          placeholder: t("Pages.Withdrawal.PleaseSelect"),  //请选择钱包地址
          options: walletOptions,
        },
      },
    ],
    [
      {
        name: 'amountAvailable', //可取金额
        label: t("Pages.Withdrawal.AmountAvailable"),
      },
      {
        type: 'TextNumber',
        props: {
          value: amountAvailable
        },
      },
    ],
    [
      {
        name: 'withdrawalAmount',//取款
        label: t("Pages.Withdrawal.WithdrawalAmount"),
        rules: [
          { required: true, message: t("Pages.Withdrawal.PleaseEnterTheAmount") },
          { pattern: /^\d+(\.\d{1,2})?$/, message: t("Pages.Withdrawal.PleaseEnterTwoDecimalPlaces") },
        ],
      },
      {
        type: 'Input',
        props: {
          placeholder: '0.00',
          //后置插槽
          suffix: (
            <span style={{ color: '#A8ABB0', fontSize: '14px', fontWeight: '400' }}>USD</span>
          ),
          //前置插槽
          // prefix: (
          //   <span style={{ color: '#A8ABB0', fontSize: '14px', fontWeight: '400' }}>USD</span>
          // ),
        },
      },
    ],
    [
      {
        name: 'Button',
      },
      {
        type: 'Button',
        props: {
          type: 'primary',
          htmlType: 'submit',
          style: {
            width: '160px',
            height: '40px',
            borderRadius: '4px',
          },
        },
        content: t("Pages.Withdrawal.Submit"),
      },
    ],
  ])

  // 提交成功后的回调
  const onFinish = async (values: any) => {
    try {
    setLoading(true)
    await postWithdrawal({ ...initialValues, ...values, withdrawalType: withdrawalType === '0' ? 'BankCard' : 'Wallet'})
      form.resetFields()
      // 后台审核同意才会更新可用金额
      const { data = [] } = await getAmountAvailable()
      // 更新可用金额
      let getNewAmount = accountOptions || []
      data.filter((todo: accountOptionsType) => getNewAmount.map((item) => 
        todo.tradingAccount === item.tradingAccount ? item.amountAvailable = Number(todo.amountAvailable) : item.amountAvailable))
      console.log(getNewAmount, 'newAmountnewAmountnewAmountnewAmount');
      setAccountOptions([...getNewAmount])
      messageApi.open({ type: 'success', content: t("Pages.Withdrawal.SubmissionSuccessful") }) //提交成功
      setLoading(false)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  };

  const formProps = {
    name: 'withdrawalFormName',
    disabled: false,
    onFinish,
    form, // 确保传递 form 实例
    labelCol: { span: 12 },
    wrapperCol: { span: 24 },
    style: { maxWidth: 482 },
    layout: 'vertical', //layout="vertical | horizonta | linline"
    initialValues
  }

  return (
    <div className="acc-box">
      {contextHolder}
      <TopTag />
      <TopTitle title={t("Pages.Withdrawal.Withdrawal")} />
      <div className="withdrawal-box">
        <div className="withdrawal-left-box">
          <DetailsForm
            formItemPropData={formItemPropData}
            formProps={formProps}
            formLoading={loading}
          />
        </div>
        <div className="center-hr" />
        <TermsPart 
          pageType={1} // 0: deposit 1: withdraw
          payType={withdrawalType === '0' ? 1 : 0} // 0: USDT 1: RMB
        />
      </div>
    </div>
  )
}

export default withTranslation()(mapRedux()(setBreadcrumbAndTitle(
  (props: { t: (key: string) => string }) => {
    const { t } = props
  // 设置面包屑和标题
  return {
    breadcrumb: [
      {
        label: t("Pages.Withdrawal.Withdrawal")
      }
    ],
    title: t("Pages.Withdrawal.Withdrawal")
  }
})(memo(WithdrawalPage))))