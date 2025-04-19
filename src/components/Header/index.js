import "./index.scss";

import {
  LogoutOutlined,
  ArrowRightOutlined,
  MinusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  UserOutlined
} from "@ant-design/icons";
import {Avatar, Dropdown, Layout, Button} from "antd";
import Breadcrumb from "src/components/Breadcrumb";
import React, {memo} from "react";
import Language from "src/components/Language";
import cn from 'classnames';
import {addRouterApi, Link} from 'src/router';

import {mapRedux} from '@/redux';
import {withTranslation, WithTranslation, useTranslation} from 'react-i18next';
import {Token} from "src/apis";


const {Header} = Layout;

export default mapRedux()(addRouterApi((props) => {
  const {
    collapsed,
    onChangeCollapsed = () => { },
    avatar = "",
    nickname = "",
    areaCode = "",
    // mobile = "",
    onClick = () => { },
    breadcrumb,
    state: {user: {userInfo} = {}} = {},
    state: {user: {userInfo: {
      displayName,
      mobile,
      email,
    }} = {}} = {},
    className = '',
    style = {},
    formName,
    pushRoute,
    routePaths
  } = props;


  const {t} = useTranslation();
  // mobile, email, nickname, areaCode, mobile
  const items = [
    {
      label: (
        <div onClick={() => pushRoute(routePaths.personalInfoWrite)}>
          {t("Components.Header.PersonalInformation")}
        </div>
      ),
      key: "item-1"
    }, // 菜单项务必填写 key
    {
      label: (
        <div onClick={() => {
          pushRoute(routePaths.logIn);
          Token.set('');
        }}>
          {t("Components.Header.LogOut")}<MinusOutlined style={{transform: 'rotate(90deg)'}} /><ArrowRightOutlined />
        </div>
      ),
      key: "item-2"
    }
  ];



  return (
    <Header className={cn("site-layout-header", className)}
      style={{
        padding: 0,
        ...style
      }}
    >

      <img src={'/static/images/logo.svg'}

        //  style={{
        //   width: "100px",
        //  }}

        alt="logo" className="img" />

      {/* {collapsed ? (
        <MenuUnfoldOutlined className="trigger" onClick={onChangeCollapsed} />
      ) : (
        <MenuFoldOutlined className="trigger" onClick={onChangeCollapsed} />
      )} */}

      {/* <Breadcrumb data={breadcrumb} /> */}



      <div className="locale-switcher   dropdown-root-box">

        {
          Object.keys(userInfo).length > 0 ? (
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div><Language {...props} /></div>
              <Dropdown
                trigger={["click"]}
                menu={{items}}
                placement="bottomRight"
                arrow={true}>
                <div className="dropdown-link" onClick={(e) => e.preventDefault()}>
                  {avatar ? (
                    <img src={avatar} />
                  ) : (
                    <Avatar size="large" icon={<UserOutlined />} />
                  )}
                  <span className="account-name">{nickname} </span>
                </div>
              </Dropdown>
            </div>
          ) : <div
            className="login-register-box"
          >
            <div> <Language {...props} />  </div>
            <div>

              <Button
                onClick={() => {
                  pushRoute('/login');
                }}
              >{t('Pages.login.loginForm_button')}</Button>

            </div>
            <div>     <Button type="primary" onClick={() => {
              pushRoute('/register');
            }}>{t("Pages.login.registerForm_button")} {'->'} </Button>   </div>
          </div>
        }
      </div>
    </Header>
  );
}));
