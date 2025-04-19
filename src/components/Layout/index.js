import "./index.scss";

import {
  Layout
  //  Menu,
  // Select
} from "antd";
import Header from "src/components/Header";
import Menu from "src/components/Menu";
import {mapRedux} from "@/redux";
import {addRouterApi} from "src/router";
import React, {
  Children,
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useState
} from "react";
// import token from "@/common/js/request/token";
// const {Sider ,Content} = Layout;
const {Content, Footer, Sider} = Layout;


// 权限跳转登录页面可以在这控制
const Index = memo((props) => {
  const {
    state: {
      breadcrumb: {items = []} = {},
      user: {userInfo: {user: {name, phone} = {}} = {}} = {}
    } = {},
    children
  } = props;

  // useEffect(() => {
  //   // 登录拦截
  //   if (!token.get()) {
  //     token.clearQueue();
  //     push("/logLn");
  //   }
  //   // hello()

  //   return () => {};
  // }, [token.get()]);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const adminCollapsed = sessionStorage.getItem("adminCollapsed");

    setCollapsed(adminCollapsed === 1 ? true : false);

    return () => { };
  }, []);
  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
    sessionStorage.setItem("adminCollapsed", !collapsed ? "1" : "0");
  }, [collapsed]);

  return (

    <div>
      {/*顶部*/}
      <Header
        // avatar="头像地址"
        nickname={name}
        areaCode={name}
        mobile={phone}
        collapsed={collapsed}
        onClick={(type) => { }}
        onChangeCollapsed={() => {
          toggle();
        }}
        breadcrumb={items}></Header>
      <Layout className="root-layout">

        <Sider
          // trigger={<div className="ant-layout-sider-trigger" >  asdfsd</div>}
          width="250"
          className="sider"
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >

          {/* <div className="demo-logo-vertical" /> */}
          <Menu collapsed={collapsed} {...props} />
          
          {/* <div>
            <div></div>
            <div>asdfdsf</div>
          </div> */}

        </Sider>



        <Layout className="site-layout">
          <Content
            style={{

            }}
          >
            {/*中间子页面*/}
            <div className="children-page-box">
              <div className="children-page">

                {Children.map(children, (child) => {
                  return cloneElement(child, props);
                  // return child;
                })}

              </div>

              {/* <footer
                style={{
                  textAlign: 'center',
                  height: '50px',
                  lineHeight: '50px',
                }}
              >
                    深圳市以凡有限公司
              </footer> */}
            </div>

          </Content>

        </Layout>
      </Layout>
    </div>
  );
});

// 装饰器
// 装饰器
export const layout = (props = {}) => {
  return (Component) => {
    return class extends React.Component {
      render() {
        return (
          <Index {...this.props} {...props}>
            <Component {...this.props} {...props} />
          </Index>
        );
      }
    };
  };
};
export default mapRedux()(addRouterApi(Index));


