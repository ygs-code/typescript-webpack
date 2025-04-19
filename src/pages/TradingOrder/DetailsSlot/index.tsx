import { useTranslation } from "react-i18next";
import "./index.scss"
import React, { useState, useEffect } from 'react'

interface DetailsSlotProps {
    record?: { [key: string]: any };
}

const DetailsSlot: React.FC<DetailsSlotProps> = ({
    record = {}
}) => {

    const { t } = useTranslation()

    const [list, setList] = useState([
        {
            id: 0,
            label: t('Pages.TradingOrder.OrderNumber'),    //订单编号
            name: 'deal',
            content: ''
        },
        {
            id: 1,
            label: t('Pages.TradingOrder.Comment'),    //备注
            name: 'comment',
            content: ''
        },
        {
            id: 2,
            label: t('Pages.TradingOrder.CommissionAgent'), //手续费
            name: 'commission',
            content: ''
        },
        // {
        //     id: 3,
        //     label: t('Pages.TradingOrder.OvernightInterest'), //隔夜利息
        //     name: 'profit',
        //     content: ''
        // },
    ])
    useEffect(() => {
        const updateList = list.map(item => (record[item.name] !== undefined) ? { ...item, content: String(record[item.name]) } : item);
        setList(updateList)  
    }, [])

    return (
        <div className="order-details-slot">
            {
                list.map((item, index) => 
                    <div className="order-details-slot-item" key={index}>
                    <span className="order-details-slot-item-label">{item.label}</span>
                    <span className="order-details-slot-item-content">{item.content}</span>
                </div>)
            }
        </div>
    );
};

export default DetailsSlot