import "./index.scss"
import { FC } from "react"
import { Popconfirm, Spin } from 'antd';
import { CurrenciesType, CardPackProps } from '@/types/cardManage'
import { useTranslation } from 'react-i18next'


// 权限控制


const CardPack: FC<CardPackProps> = ({
  title = '',
  showList = [
    // { id: 0, imgUrl: "/static/images/bank_ABC.svg", cardName: '中国银行', cardNum: '6222 ******** 0001' },
  ],
  cardPackLoading = false
}) => {
  const { t } = useTranslation()
  const confirm = (item: CurrenciesType) =>
    new Promise((resolve, reject) => {
      const res: any = item.deleteClick(item)
      if (res instanceof Promise) {
        res
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      } else {
        res ? resolve(null) : reject(null)
      }
    });

  return (
    <div className="card-pack-box">
      <div className="card-pack-title">{title}</div>
      <Spin spinning={cardPackLoading} size="large">
        <div className="card-pack-content">
          {
            showList.length > 0 && showList.map(item => (
              <div className="content-item-box" key={item.id}>
                <img src={item.imgUrl} className="img-bank" alt="" />
                <div className="item-info">
                  <div className="card-name">{item.name}</div>
                  <div className="card-num">{item.num}</div>
                </div>
                <Popconfirm
                  title={t("Pages.CardManage.Hint")}
                  description={item.delMsg}
                  onConfirm={() => confirm(item)}
                >
                  <img
                    src="/static/images/Delete_Icon.svg"
                    className="img-delete"
                    alt=""
                  />
                </Popconfirm>
              </div>
            ))
          }
        </div>
      </Spin>

    </div>
  )
}

export default CardPack