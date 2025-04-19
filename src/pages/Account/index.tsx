import "./index.scss"
import TopTag from "src/components/TopTag";
import TopTitle from "@/components/TopTitle"
import AccContent from "./AccContent"
import CreateAccount from "./CreateAccount"

import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle"
import { memo, FC, useEffect, useState } from "react"
import { useTranslation, withTranslation } from 'react-i18next'
import { GetAccountInfo, getAmountAvailable } from "@/apis"
import { Spin } from 'antd'

interface AmountType {
  amountAvailable: number;
  tradingAccount: string;
  serverID: string;
  group: string;
  groupLabel: string;
}
interface AccInfoItem {
  amountAvailable: number;
  tradingAccount: string;
  serverID: string;
  accTpye: string;
  amountList: string[]
  group: string;
  groupLabel: string;
}

interface AccountPageType {
  state: {
    user: {
        userInfo: {
            reviewStatus: number
        }
    }
  },
  dispatch: {
    user: {
        setUserInfo: (userInfo: any) => void
    }
  }
}

// 权限控制
const AccountPage: FC<AccountPageType> = (props) => {

  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  //开设按钮loading
  const [btnLoading, setBtnLoading] = useState(false)
  //账户信息列表
  const [accInfo, setAccInfo] = useState<AmountType[]>([])

  const { userInfo } = props.state.user;
  const { setUserInfo } = props.dispatch.user;
  const handleAddAcc = async () => {
    await getAccInfo()
      const { data = {} } = await GetAccountInfo()
      //更新redux账户信息
      setUserInfo({ ...userInfo, ...data })
  }

  const getAccInfo = async () => {
    try {
      setLoading(true)
      const res = await getAmountAvailable()
      const resData: AmountType[] = res.data || []
      const groupLabelArr = [t("Pages.Account.DemoAccount"), t("Pages.Account.RealAccount")]
      const accInfoList = resData.map((item) => ({
        ...item, accTpye: item.serverID === '01' ? t("Pages.Account.StandardAccount") : t("Pages.Account.StandardAccount"),
        amountList: String(item.amountAvailable).includes('.') ? String(item.amountAvailable).split('.') : [item.amountAvailable, '0'],
        groupLabel: groupLabelArr[Number(item.group)]
      }))
      setAccInfo([...accInfoList])

    }
    catch { }
    finally { setLoading(false) }
  }
  

  useEffect(() => {
    getAccInfo()
  }, [])

  //创建账户
  const [isCreateAcc, setIsCreateAcc] = useState(false)
  const switchIsCreateAcc = () => setIsCreateAcc(!isCreateAcc)
  //审核状态
  const { reviewStatus = 0 } = props.state.user.userInfo || {}
  const isFinishReal = reviewStatus === 2

  return (
    <div className="acc-box">
      {
        isCreateAcc ? 
          (<CreateAccount 
            switchIsCreateAcc={switchIsCreateAcc}
            handleAddAcc={handleAddAcc}
          />)
          : (<div className="acc-main-box">
          <TopTag />
          <TopTitle
            isShowBtn={isFinishReal}
            isShowHr={false}
            title={t("Pages.Account.WelcomeYou")}
            titleClick={switchIsCreateAcc}
            loading={btnLoading}
          />
          <Spin spinning={loading} size="large">
            <div className="acc-main-box-bottom">
              {
                accInfo && accInfo.length > 0 && accInfo.map((item: AccInfoItem) => (
                  <AccContent
                    key={item.tradingAccount}
                    title={item.groupLabel}
                    accInfoItem={item}
                  />))
              }
            </div>
          </Spin>
        </div>)
      }
    </div>
  )
}


export default withTranslation()(setBreadcrumbAndTitle((props: { t: (key: string) => string }) => {
  const { t } = props
  // 设置面包屑和标题
  return {
    breadcrumb: [
      {
        label: t("Pages.Account.Account")
      }
    ],
    title: t("Pages.Account.Account")
  }
})(memo(AccountPage)))
