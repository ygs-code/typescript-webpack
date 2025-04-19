import "./index.scss"
import TopTitle from "@/components/TopTitle"
import DetailsForm from "src/components/DetailsForm"
import TermsPart from "src/components/TermsPart"
import TopTag from "src/components/TopTag";
import { withTranslation, useTranslation } from 'react-i18next';
import { Form } from 'antd';

import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle"
import { memo, FC, useEffect } from "react"
import { mapRedux } from '@/redux';

import { getPaymentGateway, postDeposit } from '@/apis/page/deposit';
import { useState } from "react"
import { FormItemProps, SlotComponentProps } from '@/types/detailsForm'
import ModalConfirm from "@/components/ModalConfirm"
import { addRouterApi } from 'src/router'
import { uploadImg } from "src/apis";

// 权限控制
interface DepositPageProps {
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

const DepositPage: FC<DepositPageProps> = props => {
  //redux数据
  const accountInfoData = props.state.user.userInfo
  const { pushRoute, routePaths } = props
  // const t = props.t
  console.log(props, 'propspropspropsprops');

  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)

  // 选中支付方式item的下标
  const [checkPayWayIndex, setCheckPayWayIndex] = useState(-1);
  // 选中支付方式
  const [paymentGatewayType, setpaymentGatewayType] = useState('');
  const checkPayWay = (data: { id: number; imgUrl?: string; style?: React.CSSProperties; paymentGatewayType?: string; }) => {
    setCheckPayWayIndex(data.id)
    setpaymentGatewayType(data.paymentGatewayType)
    // 解除校验 支付方式
    form.setFields([{ name: 'paymentGatewayType', errors: [] }]);
  }
  // 支付方式列表
  const [paymentList, setPaymentList] = useState<{ id: number; paymentGatewayType: string; imgUrl: string; style: { width: string; height: string; }; }[]>([])
  // 账户列表
  const [selectOptions, setSelectOptions] = useState<{ value: string, label: string, serverID: string }[]>([])
  //DetailsForm的控制渲染数据
  const formItemPropData: [FormItemProps, SlotComponentProps][] = ([
    [
      {
        name: 'paymentGatewayType',//支付方式
        label: t("Pages.Deposit.PaymentGatewayType"),
        rules: [
          {
            required: true, validator: () => {
              if (checkPayWayIndex === -1) {
                return Promise.reject(new Error(t("Pages.Deposit.PleaseSelectPaymentGatewayType")))
              }
              return Promise.resolve();
            }
          },
        ],
      },
      {
        type: 'ImgBlock',
        boxStyle: {
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          cursor: 'pointer',
        },
        itemStyle: {
          width: '150px',
          height: '64px',
          border: '1px solid #D5D8DC',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        onClick: data => checkPayWay(data),
        datas: paymentList,
      },
    ],
    [
      {
        name: 'tradingAccount',//账户
        label: t("Pages.Deposit.TradingAccount"),
        //同时获取Select的value和label
        getValueFromEvent: (value, option) => ({ value, label: option.label }),
        rules: [
          {
            required: true,
            message: t("Pages.Deposit.PleaseSelectAccountType"),  //请选择账户类型
          },
        ],
      },
      {
        type: 'Select',
        props: {
          placeholder: t("Pages.Deposit.PleaseSelectAccountType"),
          options: selectOptions
        },
      },
    ],
    [
      {
        name: 'depositAmount',  //金额
        label: t("Pages.Deposit.DepositAmount"),
        rules: [
          { required: true, message: t("Pages.Deposit.PleaseEnterTwoDecimalPlaces") },
          { pattern: /^\d+(\.\d{1,2})?$/, message: t("Pages.Deposit.PleaseEnterTwoDecimalPlaces") },
          {
            validator: (_, value) => {
              // 转换为数字类型比较
              const numericValue = parseFloat(value);
              if (numericValue < 100) {
                return Promise.reject(new Error(t("Pages.Deposit.TheMinimumAmount")))
              }
              return Promise.resolve();
            }
          }
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
        name: 'filePaths', //上传凭证
        label: t("Pages.Deposit.UploadResources"),
        rules: [
          { required: true, message: t("Pages.Deposit.UploadResources") },
        ],
      },
      {
        type: 'Upload',
        props: {
          hidden: !(paymentGatewayType === 'BankTransfer'),
          maxLength: 1,
          request: uploadImg,
          requestParame: { type: 'bankTransferReceipt' }, // avatar
          style: {
            width: '100px',
            height: '100px',
          },
          value: undefined,
          onChange: (v: any[] = []) => {
            (v && v[0].status === 'done') ? setBtnLoading(false) : setBtnLoading(true)
          },
        },
      },
    ],
    [
      {
        name: 'remark',
        label: t("Pages.Deposit.Remark"),
        rules: [
          { required: true, message: t("Pages.Deposit.PleaseEnterRemarks") },
          // { type: 'number', min: 0, max: 99 },
        ],
      },
      {
        type: 'TextArea',
        props: {
          rows: '3',
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
          loading: btnLoading,
          type: 'primary',
          htmlType: 'submit',
          style: {
            width: '160px',
            height: '40px',
            borderRadius: '4px',
          },
        },
        content: t("Pages.Deposit.Submit"),
      },
    ],
  ])

  useEffect(() => {
    //同步请求
    const fetchData = async () => {
      try {
        //账户下选框数据
        const transformedArray = (accountInfoData.relatedTradingAccounts && accountInfoData.relatedTradingAccounts.length > 0) ?
          accountInfoData.relatedTradingAccounts.map((item: { serverID: string; tradingAccount: string }) => ({
            value: item.tradingAccount,
            label: item.tradingAccount,
            serverID: item.serverID,
          })) : []
        setSelectOptions([...transformedArray])
        //获取支付方式
        const paymentParams = {}
        setLoading(true)
        const res = await getPaymentGateway(paymentParams)
        const resData = res.data || []
        //支付方式匹配图片 图片拼接PaymentMode_${'XPay'}.png
        let paymentList: { id: number; paymentGatewayType: string; imgUrl: string; style: { width: string; height: string; }; }[] = []
        if (resData.length > 0) {
          resData.filter((item: { isEnable: boolean; paymentGatewayType: string; }, index: number) =>
            item.isEnable ? paymentList.push({
              id: index, paymentGatewayType: item.paymentGatewayType,
              imgUrl: `/static/images/PaymentMode_${item.paymentGatewayType}.png`, style: { width: '120px', height: '30px' }
            }) : '')
        }
        setPaymentList([...paymentList])
        setLoading(false)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  const [form] = Form.useForm()
  const formSubmit = async (values: any) => {
    try {
      //入金请求
      const option = selectOptions.find(item => item.label === values.tradingAccount.label)
      const params = { baseCurrency: 'USD', ...values, tradingAccount: option.label, serverID: option.serverID }
      setLoading(true)
      const depositInfo = await postDeposit(params)
      //清空表单
      form.resetFields()
      setpaymentGatewayType('')
      setCheckPayWayIndex(-1)
      setLoading(false)
      //请求成功打开支付页面
      if (depositInfo && depositInfo.data) window.open(depositInfo.data.domain + depositInfo.data.chargeId);
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  // 提交成功后的回调
  const onFinish = (values: any) => {
    console.log(values, 'onFinishonFinishonFinish');
    formSubmit({ ...values, paymentGatewayType })
  };

  const formProps = {
    name: 'formName',
    disabled: false,
    onFinish,
    form, // 确保传递 form 实例
    labelCol: { span: 12 },
    wrapperCol: { span: 24 },
    style: { maxWidth: 482 },
    layout: 'vertical', //layout="vertical | horizonta | linline"
    // initialValues
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
          <div className="acc-box">
            <TopTag />
            <TopTitle title={t("Pages.Deposit.Deposit")} />
            <div className="deposit-box">
              <div className="deposit-left-box">
                <DetailsForm
                  formItemPropData={formItemPropData}
                  formProps={formProps}
                  checkPayWayIndex={checkPayWayIndex}
                  formLoading={loading}
                />
              </div>
              <div className="center-hr" />
              <TermsPart 
                pageType={0} // 0: deposit 1: withdraw
                payType={paymentGatewayType === 'BankTransfer' ? 1 : 0} // 0: USDT 1: RMB
              />
            </div>
          </div>
      }
    </>
  )
}

export default withTranslation()(addRouterApi(mapRedux()(setBreadcrumbAndTitle((props: { t: (key: string) => string }) => {
  const { t } = props
  // 设置面包屑和标题
  return {
    breadcrumb: [
      {
        label: t("Pages.Deposit.Deposit")
      }
    ],
    title: t("Pages.Deposit.Deposit")
  }
})(memo(DepositPage)))))
