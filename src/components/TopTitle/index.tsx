import "./index.scss";
import { FC } from "react";
import { Button } from "antd";
import { useTranslation } from 'react-i18next';
interface TopTitleType {
    title?: string
    isShowBtn?: boolean
    titleClick?: () => void
    isShowHr?: boolean
    loading?: boolean
}

const TopTitle: FC<TopTitleType> = ({ 
    title = '', 
    isShowBtn = false,
    titleClick = () => {},
    isShowHr = true,
    loading = false
 }) => {
    const { t } = useTranslation()

    return (
        <div className="main-box-top">
            <div className="main-box-content">
                <span className="welcome-span">{title}</span>
                <div className="welcome-btn">
                    {
                        isShowBtn && (<Button loading={loading} type="primary" onClick={titleClick}>
                            {t("Pages.Account.OpenNewAcc")}
                        </Button>)
                    }
                </div>
            </div>
            {isShowHr && (<div className="welcome-hr" />)}
        </div>
    )
}

export default TopTitle