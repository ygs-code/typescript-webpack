import "./index.scss";
import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle";
import React, { memo, FC, useEffect } from "react";
import { DepositLinkSite } from "@/apis";
import { addRouterApi, Link } from 'src/router';
import { Button, Result, Skeleton } from 'antd';

// 权限控制
interface PayPageProps {
  match: {
    params: {
      checkoutId: string;
      chargeId: string;
    };
  };
  pushRoute: (path: string) => void;
  routePaths: {
    account: string;
  };
}

const PayPage: FC<PayPageProps> = (props) => {
  const {
    match: {
      params: {
        checkoutId,
        chargeId
      } = {}
    },
    pushRoute,
    routePaths
  } = props
  const [loading, setLoading] = React.useState(true)
  const [status, setStatus] = React.useState(false)
  const [data, setData] = React.useState({})
  useEffect(() => {
    DepositLinkSite({
      checkoutId,
      chargeId
    }).then(res => {
      setLoading(false)
      setStatus(true)
      setData(data)
    }).catch((error) => {

      console.log('error==', error)
      setLoading(false)
      setData(error)
      setStatus(false)
    })
  }, []);
  return (
    <div className="home">
      {
        loading ? <Skeleton /> :
          <div>


            {
              status ? <Result
                status="success"
                title="支付成功"
                subTitle={
                  <div>
                    {/* <dl>
              <dd>支付金额：100元</dd>
              <dd>支付方式：微信支付</dd> 
              <dd>支付订单：4123432dxxx</dd> 
              <dd>货币：uds</dd> 
            </dl> */}
                  </div>
                }
                extra={[
                  <Button type="primary"

                    onClick={() => {

                      pushRoute(routePaths.account)

                    }}
                  >
                    返回首页
                  </Button>,
                ]}
              /> : <Result
                status="error"
                title="支付失败"
                subTitle={
                  data?.error
                }
                extra={[
                  <Button type="primary"

                    onClick={() => {

                      pushRoute(routePaths.account)

                    }}
                  >
                    返回首页
                  </Button>,
                ]}
              >
                {/* <div className="desc">
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              The content you submitted has the following error:
            </Text>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account has been
            frozen. <a>Thaw immediately &gt;</a>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet
            eligible to apply. <a>Apply Unlock &gt;</a>
          </Paragraph>
        </div> */}
              </Result>
            }
          </div>
      }
    </div>
  );
};

export default setBreadcrumbAndTitle({
  title: "支付页面"
})(addRouterApi(PayPage));