import {Skeleton} from "antd";
import Layout from "src/components/Layout";
import {mapRedux} from "@/redux";
import Routers, {addRouterApi} from "src/router";
import React, {useCallback, useEffect, useState} from "react";
import {verifyToken} from "@/apis";
import {getToken, GetAccountInfo, GetUserInfo} from "@/apis";
import {user} from "src/redux/models";


const Index = (props) => {
  const {
    dispatch: {
      user: {setUserInfo} = {}
    } = {}
  } = props;
  const {history} = props;
  const userInfo = props.state.user.userInfo;
  const [loading, setLoading] = useState(true);
  const accountInfo = async () => {
    // 如果已经登录了 则跳去首页
    let res = await GetUserInfo({});
    setUserInfo({...userInfo, ...res.data});
    //异步请求后续的较多数据
    let accRes = await GetAccountInfo({});
    setUserInfo({...userInfo, ...accRes.data});
  };

  useEffect(() => {
    accountInfo().then(() => {
      setLoading(false);
    });
  }, []);



  return (
    <Skeleton active loading={loading}>
      <Layout>
        <Routers
          level={2}
          history={history}
        />
      </Layout>
    </Skeleton>
  );
};

export default mapRedux()(addRouterApi(Index));
