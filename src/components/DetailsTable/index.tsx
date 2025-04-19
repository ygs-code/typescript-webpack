import "./index.scss"

import { Select, Radio, Table, DatePicker, Pagination } from 'antd';

import { FC, Fragment } from "react"
import { useTranslation } from 'react-i18next'

const { RangePicker } = DatePicker;

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  description: string;
  tags: string[];
}


// 权限控制
interface DetailsTableProps {
  searchItemProps?: { props?: Record<string, any> };
  tableItemProps?: Array<{ id: number; mode: string; type: string; props?: Record<string, any> }>;
  tableProps?: Record<string, any>;
  paginationProps?: Record<string, any>;
}

const DetailsTable: FC<DetailsTableProps> = ({
  searchItemProps = { props: {} },
  tableItemProps = [],
  tableProps = {},
  paginationProps = {}
}) => {

  const { t } = useTranslation()

  return (
    <div className="order-box">
      <div className="order-main">
        <div className="order-form">
          {/* 后续如果表单多的话可以替换成DetailsForm */}
          <span className="order-form-span">{t("Pages.TradingOrder.TradingAccount")}</span>

            <Select
              className="order-form-select"
              {...searchItemProps.props}
            />
        </div>
        <div className="order-filter">
          {
            tableItemProps.map((item, index) => item.mode === 'filter' && (
              <div className="order-filter-item" key={item.id}>
                {(() => {
                  switch (item.type) {
                    case 'radio':
                      return (
                        <Radio.Group
                          className="order-filter-radio"
                          optionType="button"
                          buttonStyle="solid"
                          {...item.props}
                        />
                      )
                    case 'rangePicker':
                      return (
                        <RangePicker 
                          className="order-filter-range-picker" 
                          {...item.props}
                        />
                      )
                    default:
                      return <></>
                  }
                  })()
                }
              </div>
            ))
          }
        </div>
        <div className="order-table-box">
          <div className="order-table">
            <Table<DataType>
              {...tableProps}
            />
          </div>
          <div className="order-pagination">
            <Pagination
              {...paginationProps}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsTable