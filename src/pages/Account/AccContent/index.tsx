import "./index.scss";
import { FC } from "react"
interface AccContentType {
    title?: string
    accInfoItem: AccInfoItem
}

interface AccInfoItem {
    amountAvailable: number;
    tradingAccount: string;
    serverID: string;
    accTpye: string;
    amountList: string[]
    
  }
  
const AccContent: FC<AccContentType> = ({
    title = '',
    accInfoItem = {
        amountAvailable: 0,
        tradingAccount: '',
        serverID: '',
        accTpye: '',
        amountList: []
    },
}) => {
    //设置多语言默认值
    return (
        <div className="acc-content-box">
            <span className="content-title">{title}</span>
            <div className="content-hr">
                <div />
            </div>
            <div className="content-bottom-box">
                <div className="content-left-box">
                <div className="content-left-item">
                        <span>{accInfoItem.accTpye}</span>
                    </div>
                    <div className="content-left-item">
                        <span>{accInfoItem.tradingAccount}</span>
                    </div>
                </div>
                <div className="content-right">
                    <div className="content-num">
                        <span className="num-left">{accInfoItem.amountList[0] + '.'}</span>
                        <span className="num-right">{accInfoItem.amountList[1] + ' USD'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccContent