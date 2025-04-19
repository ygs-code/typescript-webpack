import "./index.scss";
import { FC } from "react";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

interface TopTitleType {
    tabsPorps: { items: TabsProps['items'] }
}

const TopTitle: FC<TopTitleType> = ({ 
    tabsPorps = {}
 }) => {
    return (
        <div className="main-box-top">
            <Tabs 
                { ...tabsPorps }
            />
        </div>
    )
}

export default TopTitle