import "./index.scss";
import { FC } from "react";
import { Button } from "antd";
import { useTranslation } from 'react-i18next';
import { addRouterApi } from 'src/router';
import { mapRedux } from '@/redux';
// import Link from 'next/link';
// import { Link } from 'src/router';

interface TopTagProps {
    pushRoute: (path: string) => void
    routePaths: {
        personalInfoWrite: string
    }
    state: {
        user: {
            userInfo: {
                reviewStatus: number
            }
        }
    }
}

const TopTag: FC<TopTagProps> = (props) => {
    const { t } = useTranslation()

    const { reviewStatus = 0 } = props.state.user.userInfo || {}
    // 0未提交审核，1未审核，2已审核通过，3已驳回
    const isFinishReal = reviewStatus === 1 || reviewStatus === 2
    console.log('isFinishReal, reviewStatus', isFinishReal, reviewStatus)

    const toPersonCenter = () => props.pushRoute(props.routePaths.personalInfoWrite)

    return (
        <>
           {
                !isFinishReal && (
                    <div className="main-box">
                        <div className="left-box">
                            <img src='/static/images/CptInfo.png' alt="" />
                            <span>{t("Pages.Account.CptInfoMsg")}</span>
                        </div>
                        <Button className="open-btn" type="primary" onClick={toPersonCenter}>
                            {t("Pages.Account.CptInfo")}
                        </Button>
                    </div>
                ) 
            }
        </>
    )
}

export default mapRedux()(addRouterApi(TopTag))