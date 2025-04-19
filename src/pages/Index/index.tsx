import "./index.scss";
import setBreadcrumbAndTitle from "src/components/setBreadcrumbAndTitle";
import React, { memo, FC, useEffect } from "react";
import { addRouterApi, Link } from 'src/router';

// 权限控制
const HomePage: FC = (props) => {

  const {
 
    pushRoute,
    routePaths
  } = props
  useEffect(() => {
    pushRoute(routePaths.account)
  }, [])

  return (
    <div className="home">
      <div className="text-red-500 title">用户中心</div>

    </div>
  );
};

export default setBreadcrumbAndTitle({
  // 设置面包屑和标题
  breadcrumb: [
    {
      label: "主页"
    }
  ],
  title: "主页"
})(addRouterApi(HomePage));