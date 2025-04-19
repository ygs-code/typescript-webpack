import "./index.scss"
import { FC } from "react"
import { useTranslation } from 'react-i18next'

interface TermsPartProps {
  pageType?: number
  payType?: number
}

// 权限控制
const TermsPart: FC<TermsPartProps> = ({
  pageType = 0, // 0 deposit 1 withdraw
  payType = 0, // 0 USDT 1 RMB
}) => {
  const { t } = useTranslation()

  const list1_1 = [
    // '单笔最低为100USDT，最高为XXXUSDT；',
    // '转账金额必须是扣除手续费后，等于该订单的金额，否则将会导致无法到账；',
    // '每次存款都需重新提交，旧订单地址无效，切勿重复使用；',
    // '如因输入错误导致任何损失，或者到账延迟导致的汇率变动，我司概不负责；',
    // t('Components.TermsPart.TheMinimumAmountPerTransaction') + '--' + t('Components.TermsPart.USDT'),
    t('Components.TermsPart.TheMinimumAmount'),
    t('Components.TermsPart.TheTransferAmountMsg'),
    t('Components.TermsPart.EachDepositMustBeResubmitted'),
    t('Components.TermsPart.OurCompanyIsNotResponsible')
  ]

  const list1_2 = [
    // '请勿频繁重复提交存款申请，以免被风控;',
    // '存款必须为本人账户，禁止第三方存款；',
    // '每次转账后请保留截图，以作备用；',
    // '如有问题，请您联系在线客服或者电邮至info@rrbullgold.com查询；',
    t('Components.TermsPart.PleaseDoNotSubmitDepositApplications'),
    t('Components.TermsPart.DepositsMustBeMadeToOnesOwnAccount'),
    t('Components.TermsPart.PleaseKeepScreenshotAfterEachTransferForBackup'),
    t('Components.TermsPart.PleaseContactOurOnlineCustomerService'),
  ]

  const list1_3 = [
    // 单笔最低为XXX人民币，最高为--人民币；
    // 存款时间为：XXX
    // 请勿填写任何备注及附言；
    // 工作日的晚间或假期间的转账均可能延迟到账，请预留足够的时间处理；
    t('Components.TermsPart.MinimumSingleTransactionAmountIs') + 'X' + t('Components.TermsPart.RMBUpTo') + '--' + t('Components.TermsPart.RMB'),
    t('Components.TermsPart.DepositTimeIs') + 'XX',
    t('Components.TermsPart.PleaseDoNotFillInAnyRemarksOrComments'),
    t('Components.TermsPart.TransfersMadeDuringTheEveningHoursOfWeekdays'),
  ]

  const list1_4 = [
    // 请勿频繁重复提交存款申请，以免被风控；
    // 存款必须为本人账户，禁止第三方存款；
    // 每次转账后请保留截图，以作备用；
    // 如有问题，请您联系在线客服或者电邮至info@rrbullgold.com查询；
    t('Components.TermsPart.PleaseDoNotSubmitDepositApplications'),
    t('Components.TermsPart.DepositsMustBeMadeToOnesOwnAccount'),
    t('Components.TermsPart.PleaseKeepScreenshotAfterEachTransferForBackup'),
    t('Components.TermsPart.PleaseContactOurOnlineCustomerService'),
  ]

  const list2_1 = [
    // 最低取款金额为USD20.
    // 取款的钱包地址必须为本人实名拥有，禁止第三方取款；
    // 我司可能需要向您索取钱包的实名相关证明文件；
    // 请确保钱包地址正确，如因输入错误而导致的任何损失，我司概不负责；
    t('Components.TermsPart.TheMinimumWithdrawalAmountIsUSD20'),
    t('Components.TermsPart.TheWalletAddressForWithdrawalMustBeOwned'),
    t('Components.TermsPart.WeMayNeedToAskDocumentsOfYourWallet'),
    t('Components.TermsPart.PleaseMakeSureTheWalletAddressIsCorrect'),
  ]

  const list2_2 = [
    // 建议在没有持仓的情况下才提交取款申请；
    // 若取款时持有仓位，可提交的金额为未用保证金；
    // 如有问题，请您联系在线客服或者电邮至info@rrbullgold.com查询；
    t('Components.TermsPart.ItIsRecommendedToSubmitWithdrawalApplication'),
    t('Components.TermsPart.IfYouHoldPositionWhenWithdrawingFunds'),
    t('Components.TermsPart.IfYouHaveAnyQuestionsPleaseContact'),
  ]

  const list2_3 = [
    // 最低取款金额为USD20.
    // 取款的银行卡必须为本人实名拥有，禁止第三方取款；
    // 请确保银行卡正确，如因输入错误而导致的任何损失，我司概不负责；
    t('Components.TermsPart.TheMinimumWithdrawalAmountIsUSD20'),
    t('Components.TermsPart.TheBankCardUsedToWithdrawMoneyMustBeOwned'),
    t('Components.TermsPart.PleaseEnsureThatTheBankCardInformationIsCorrect'),
  ]

  const list2_4 = [
    // 建议在没有持仓的情况下才提交取款申请；
    // 若取款时持有仓位，可提交的金额为未用保证金；
    // 如有问题，请您联系在线客服或者电邮至info@rrbullgold.com查询；
    t('Components.TermsPart.ItIsRecommendedToSubmitWithdrawalApplication'),
    t('Components.TermsPart.IfYouHoldPositionWhenWithdrawingFunds'),
    t('Components.TermsPart.IfYouHaveAnyQuestionsPleaseContact'),
  ]

  //dataList[number][payType]
  const dataList = [
    // deposit
    [
      // USDT
      [
        list1_1,
        list1_2,
      ],
      // RMB
      [
        list1_3,
        list1_4,
      ]
    ],
    // withdraw
    [
       // USDT
      [
        list2_1,
        list2_2,
      ],
      // RMB
      [
        list2_3,
        list2_4,
      ]
    ],
  ]
  
  const noteList = dataList[pageType][payType][0]
  const tipList = dataList[pageType][payType][1]

  return (
    <>
      <div className="deposit-right-box">
        <div className="text-item">
          {/* 【注意事项】 */}
          <div className="text-title">{`【${t('Components.TermsPart.ThingsToNote')}】`}</div>
          <div>
            {noteList.map((item, index) => (<li key={index}>{item}</li>))}
          </div>
        </div>
        <div className="text-item" style={{ marginTop: "24px" }}>
          {/* 【温馨提示】 */}
          <div className="text-title">{`【${t('Components.TermsPart.KindTips')}】`}</div>
          <div>
            {tipList.map((item, index) => (<li key={index}>{item}</li>))}
          </div>
        </div>
      </div>
    </>
  )
}

export default TermsPart
