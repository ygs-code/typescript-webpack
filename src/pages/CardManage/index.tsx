import "./index.scss"
import TopTag from "@/components/TopTag";
import TopTabs from "@/components/TopTabs"
import DetailsForm from "@/components/DetailsForm"
import CardPack from "./CardPack"

import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle"
import { memo, FC, useState, useEffect, useCallback } from "react"
import { useTranslation, withTranslation } from 'react-i18next'
import { Form, message } from 'antd';

import { getBanks, getPaymentChain, getCreditCardsWallets, postBindBankCard, postBindWalletAddr, deleteBankCard, deleteWalletAddr } from '@/apis/page/cardManage'
import { CurrenciesType, BanksType, FormItemProps, SlotComponentProps, CardFormValues, WalletFormValues } from '@/types/cardManage'
import ModalConfirm from "src/components/ModalConfirm";
import { addRouterApi } from 'src/router'

interface CardManagePageProps {
  pushRoute: (path: string) => void
  routePaths: {
      personalInfoWrite: string
  },
  state: {
    user: {
      userInfo: any;
    };
  };
}
// 权限控制
const CardManagePage: FC<CardManagePageProps> = (props) => {
  const { pushRoute, routePaths  } = props

  const { t } = useTranslation()
  //form loading
  const [loading, setLoading] = useState<boolean>(false)
  //cardPack loading
  const [cardPackLoading, setCardPackLoading] = useState<boolean>(false)

  const [messageApi, contextHolder] = message.useMessage()
  //银行卡列表
  const [bankOptions, setBankOptions] = useState<Array<{ id: string; value: string; label: string } & BanksType>>([])
  //钱包支付链列表
  const [walletOptions, setWalletOptions] = useState<Array<{ id: string; value: string; label: string } & CurrenciesType>>([])

  const [showCardList, setShowCardList] = useState<Array<{ id: string; imgUrl: string; name: string; num: string } & BanksType & CurrenciesType>>([
    // { id: 0, imgUrl: `/static/images/${'Abbr'}.svg`, cardName: '中国银行', cardNum: '6222 ******** 0001' }
  ])
  const [showWalletList, setShowWalletList] = useState<Array<{ id: string; imgUrl: string; name: string; num: string } & CurrenciesType>>([])

  useEffect(() => {
    //获取银行下选数据
    getBanks().then(res => {
      let banksList = res.data || []
      banksList = banksList.filter((item: BanksType) => item.isEnable).map((item: BanksType) =>
        ({ ...item, id: item.id, label: item.bankName, value: item.id }))
      setBankOptions(banksList)
    })
    //获取支付链下选数据
    getPaymentChain().then(res => {
      let paymentChainList = res.data.currencies || []
      paymentChainList = paymentChainList.map((item: CurrenciesType) =>
        ({ ...item, id: item.paymentChainId, label: item.title, value: item.paymentChainId }))

      setWalletOptions(paymentChainList)
    })

    //获取银行卡钱包列表
    handleCardsWallets()
  }, [])

  //DetailsForm的控制渲染数据
  //新增银行卡
  const cardFormItemPropData: [FormItemProps, SlotComponentProps][] = [
    [
      {
        name: 'bankCardNumber', //卡号
        label: t("Pages.CardManage.CardNumber"),
        rules: [
          { required: true, message: t("Pages.CardManage.PleaseEnter") },
          { pattern: /^[a-zA-Z0-9]{13,19}$/, message: t("Pages.CardManage.13to19Msg") }
        ],
      },
      {
        type: 'Input',
        props: {
          placeholder: t("Pages.CardManage.PleaseEnter"),
          maxLength: 19
        },
      },
    ],
    [
      {
        name: 'bankName', //银行
        label: t("Pages.CardManage.Bank"),
        rules: [
          { required: true, message: t("Pages.CardManage.PleaseSelect") },
        ],
      },
      {
        type: 'Select',
        props: {
          placeholder: t("Pages.CardManage.PleaseSelect"),
          options: bankOptions,
        },
      },
    ],
    [
      {
        name: 'bankBranch',  //支行
        label: t("Pages.CardManage.Branch"),
        rules: [
          { required: true, message: t("Pages.CardManage.PleaseEnter") },
          // { pattern: /^\d/, message: '只能输入数字' },
        ],
      },
      {
        type: 'Input',
        props: {
          placeholder: t("Pages.CardManage.PleaseEnter"),
        },
      },
    ],
    [
      {
        name: 'Button', //占位
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
        content: t("Pages.CardManage.Submit"),
      },
    ],
  ]
  //新增钱包
  const walletItemPropData: [FormItemProps, SlotComponentProps][] = [
    [
      {
        name: 'walletAddr',  //钱包地址
        label: t("Pages.CardManage.WalletAddress"),
        rules: [
          { required: true, message: t("Pages.CardManage.PleaseEnter") },
          { pattern: /^[a-zA-Z0-9]{13,50}$/, message: t("Pages.CardManage.12to50Msg") }
        ],
      },
      {
        type: 'Input',
        props: {
          placeholder: t("Pages.CardManage.PleaseEnter"),
        },
      },
    ],
    [
      {
        name: 'paymentChainId', //支付链
        label: t("Pages.CardManage.PaymentChain"),
        rules: [
          { required: true, message: t("Pages.CardManage.PleaseEnter") },
          //input的校验规则
          // { pattern: /^\d+$/, message: '只能输入数字' }
        ],
      },
      {
        type: 'Select',
        props: {
          placeholder: t("Pages.CardManage.PleaseSelect"),
          options: walletOptions,
        },
      },
    ],
    [
      {
        name: 'button',
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
        content: t("Pages.CardManage.Submit"),
      },
    ],
  ]


  //表单实例
  const [cardForm] = Form.useForm()
  const [walletForm] = Form.useForm()

  const cardSubmit = async (values: CardFormValues) => {
    try {
      if (showCardList.length >= 5) {
        messageApi.open({ type: 'warning', content: t("Pages.CardManage.Max5Card") }) //最多绑定五张银行卡
        return
      }

      const { bankName, bankBranch, bankCardNumber } = values
      // form中返回的bankName是ID，需要转换成银行名
      const handleBankName = bankOptions.find(item => item.id === bankName)?.bankName || ''
      const abbr = bankOptions.find(item => item.id === bankName)?.abbr || ''
      const params = {
        bankName: handleBankName,
        abbr,
        bankBranch,
        bankCardNumber,
      }
      setLoading(true)
      await postBindBankCard(params)
      messageApi.open({ type: 'success', content: t("Pages.CardManage.AddedSuccessfully") }) //添加成功！
      handleCardsWallets()
      //清空表单
      cardForm.resetFields()
    }
    catch (error) {
      console.log(error)

    }
    finally {
      setLoading(false)
    }
  }

  const walletSubmit = async (values: WalletFormValues) => {
    try {
      const handleValus = { ...walletOptions.find(item => item.value === values.paymentChainId) || {}, ...values }
      const { walletAddr, paymentChainId, currency, title, nodeType } = handleValus
      const params = { walletAddr, paymentChainId, currency, title, nodeType }
      setLoading(true)
      await postBindWalletAddr(params)
      messageApi.open({ type: 'success', content: t("Pages.CardManage.AddedSuccessfully") }) //添加成功！
      handleCardsWallets()
      //清空表单
      walletForm.resetFields()
    } catch (error) {
      console.log(error)

    }
    finally {
      setLoading(false)
    }

  }

  const onFinish = (values: CardFormValues | WalletFormValues) => {
    if (tabKey === '0' && 'bankName' in values && 'bankBranch' in values && 'bankCardNumber' in values) {
      cardSubmit(values)
    } else if (tabKey === '1' && 'walletAddr' in values && 'paymentChainId' in values) {
      walletSubmit(values)
    }
  }


  //tabs下标
  const [tabKey, setTabKey] = useState('0')

  const handleCardsWallets = () => {
    setCardPackLoading(true)
    getCreditCardsWallets().then(res => {
      //更新银行卡信息
      const creditCards = res.data.creditCards || []
      const bankList = creditCards.map((item: BanksType) =>
      ({
        ...item, id: item.bankCardNumber, imgUrl: `/static/images/bank_${item.abbr}.svg`, name: item.bankName,
        num: item.bankCardNumber, delMsg: t("Pages.CardManage.DelCardMsg"), deleteClick
      }));
      setShowCardList([...bankList]);
      //更新钱包信息
      const walletAddrs = res.data.walletAddrs || []
      const walletList = walletAddrs.map((item: CurrenciesType) =>
      ({
        ...item, id: item.walletAddr, imgUrl: `/static/images/wallet_${item.currency}.svg`, name: item.title,
        num: item.walletAddr, delMsg: t("Pages.CardManage.DelWalletMsg"), deleteClick
      }));
      setShowWalletList([...walletList]);
      setCardPackLoading(false)
    })
      .catch(err => console.log(err))
      .finally(() => setCardPackLoading(false))
  }

  const deleteClick = useCallback(async (item: BanksType | CurrenciesType) => {
    // console.log(tabKey, item, 'itemitem'); //tabKey这里没有更新
    if ('bankCardNumber' in item) {
      const res = await deleteBankCard(item.bankCardNumber)
      handleCardsWallets()
      return res
    } else if ('walletAddr' in item) {
      const res = await deleteWalletAddr(item.walletAddr)
      handleCardsWallets()
      return res
    }
    return null
  }, [tabKey]);

  const cardFormProps = {
    name: 'cardForm',
    disabled: false,
    validateMessages: {},
    form: cardForm, // 确保传递 form 实例
    labelCol: { span: 12 },
    wrapperCol: { span: 24 },
    style: { maxWidth: 482 },
    layout: 'vertical', //layout="vertical | horizonta | linline"
    onFinish
  }

  const walletFormProps = {
    name: 'walletForm',
    disabled: false,
    validateMessages: {},
    form: walletForm, // 确保传递 form 实例
    labelCol: { span: 12 },
    wrapperCol: { span: 24 },
    style: { maxWidth: 482 },
    layout: 'vertical', //layout="vertical | horizonta | linline"
    onFinish
  }

  const items = [
    {
      key: '0',
      label: t("Pages.CardManage.AddBankCard"), //新增银行卡
      children:
        (<div className="card-manage-box">
          <div className="card-manage-left-box">
            <DetailsForm
              formItemPropData={cardFormItemPropData}
              formProps={cardFormProps}
              formLoading={loading}
            />
          </div>
          {
            showCardList.length > 0 ?
              <CardPack
                title={t("Pages.CardManage.CardManagement")}
                showList={showCardList}
                cardPackLoading={cardPackLoading}
              /> : null
          }

        </div>)
    },
    {
      key: '1',
      label: t("Pages.CardManage.AddnewWallet"), //新增钱包
      children:
        (<div className="card-manage-box">
          <div className="card-manage-left-box">
            <DetailsForm
              formItemPropData={walletItemPropData}
              formProps={walletFormProps}
              formLoading={loading}
            />
          </div>
          {
            showWalletList.length > 0 ?
            <CardPack
            title={t("Pages.CardManage.WalletManagement")}
            showList={showWalletList}
            cardPackLoading={cardPackLoading}
          /> : null
          }
          
        </div>)
    }
  ]
  //
  const tabsPorps = {
    defaultActiveKey: "0",
    tabBarGutter: 40,
    items,
    onChange: useCallback((key: string) => setTabKey(key), []) // 依赖项数组，确保 setTabKey 是一个有效的函数
  }

  //是否完成实名认证
  const { reviewStatus = 0 } = props.state.user.userInfo || {}
  //实名状态
  const isFinishReal = reviewStatus === 2
  const [isMcOpen, setIsMcOpen] = useState(!isFinishReal)
  const switchMcOpen = () => setIsMcOpen(!isMcOpen)
  const handleOk = () => {
    pushRoute(routePaths.personalInfoWrite)
    switchMcOpen()
  }
  const handleCancel = () => switchMcOpen()

  return (
    <>
      {
        !isFinishReal ? 
        <ModalConfirm 
          isOpen={isMcOpen}
          switchOpen={switchMcOpen}
          content={t('Components.ModalConfirm.PleaseCompletePersonalInformationMsg')}
          leftBtnSpan={t('Components.ModalConfirm.CptInfo')}
          rightBtnSpan={t('Components.ModalConfirm.Cancel')}
          handleOk={handleOk}
          handleCancel={handleCancel}
        /> : 
        <div>
        {contextHolder}
        <TopTag />
        <TopTabs tabsPorps={tabsPorps} />
      </div>
      }
    </>
    

  )
}

export default withTranslation()(addRouterApi(setBreadcrumbAndTitle(
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
  })(memo(CardManagePage))))