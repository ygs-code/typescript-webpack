import {
  // MenuUnfoldOutlined,
  // MenuFoldOutlined,
  UserOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BarChartOutlined,
  FlagOutlined,
  // VideoCameraOutlined,
  // UploadOutlined,
  // HomeOutlined,
  // PieChartOutlined,
  // DesktopOutlined,
  // ContainerOutlined,
  // MailOutlined,
  // AppstoreOutlined,
  // WarningOutlined,
  SettingOutlined,
  SnippetsOutlined
  // ProjectOutlined
} from "@ant-design/icons";

import {
  Menu
  //  Select
} from "antd";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

export default (routePaths, t) => [
  {
    title: t("Components.Menu.Account"),  //账户
    iconComponent: <UserOutlined />,
    url: routePaths.account, // 路由地址
    // children: [
    //   {
    //     title: "账户",
    //     url: routePaths.userManagement, // 路由地址
        //     children: [
        //       // 子菜单
        //     ]
    //   }
    // ]
  },
  {
    title: t("Components.Menu.Wallet"), //钱包 
    iconComponent: <WalletOutlined />,
    children: [
      {
        title: t("Components.Menu.Deposit"), // 入金 
        url: routePaths.deposit  , // 路由地址
        params:{
          action: 'create'
        },
        // query,
      },
      {
        title: t("Components.Menu.Withdrawal"),  // 出金 
        url: routePaths.withdrawal, // 路由地址
        params:{
          action: 'create'
        },
      },
      {
        title: t("Components.Menu.CardManage"),  // 卡管理 
        url: routePaths.cardManage, // 路由地址
        params:{
          action: 'create'
        },
      },
    ]
  },
  {
    title: t("Components.Menu.Report"),  // 报表 
    iconComponent: <BarChartOutlined />,
    children: [
      {
        title: t("Components.Menu.TradingOrder"),  // 交易订单 
        url: routePaths.tradingOrder  , // 路由地址
        params:{
          action: 'create'
        },
        // query,
      },
      {
        title: t("Components.Menu.DepositAndWithdrawalReport"),  // 出入金报表 
        url: routePaths.depositAndWithdrawalReport  , // 路由地址
        params:{
          action: 'create'
        },
        // query,
      },
    ]
  },
  {
    title: t("Components.Menu.LowerLevelCustomers"),  // 下级客户 
    iconComponent: <BarChartOutlined />,
    children: [
      {
        title: t("Components.Menu.CustomerList"),  // 客户列表 
        url: routePaths.customerList, // 路由地址
        params:{
          action: 'create'
        },
      },
      {
        title: t("Components.Menu.TradingOrder"),  // 交易订单 
        url: routePaths.customerTradingOrder, // 路由地址
        params:{
          action: 'create'
        },
      },
      {
        title: t("Components.Menu.DepositAndWithdrawalReport"),  // 出入金报表 
        url: routePaths.customerDepositAndWithdrawalReport, // 路由地址
        params:{
          action: 'create'
        },
      },
    ]
  },
  {
    title: t("Components.Menu.Setting"),  // 设置 
    iconComponent: <SettingOutlined />,
    children: [
      {
        title: t("Components.Menu.PersonalInfoWrite"), // 实名认证 
        url: routePaths.personalInfoWrite  , // 路由地址
        params:{
          action: 'create'
        },
        // query,
      },
      // {
      //   title: "实名认证2",
      //   url: routePaths.personalInfoChecked, // 路由地址
      //   params:{
      //     action: 'create'
      //   },
      // },
      {
        title: t("Components.Menu.ChangePassword"), // 更改密码 
        url: routePaths.changePassword, // 路由地址
        params:{
          action: 'create'
        },
      },
    ]
  },
  // {
  //   title: "系统设置",
  //   iconComponent: <SettingOutlined />,
  //   children: [
  //     {
  //       title: "用户权限设置",
  //       // children: [
  //       //   {
  //       //     title: "用户管理",
  //       //     url: routePaths.userManagement, // 路由地址
  //       //     children: [
  //       //       // 子菜单
  //       //     ]
  //       //   },
  //       //   {
  //       //     title: "角色管理",
  //       //     url: routePaths.roleManagement, // 路由地址
  //       //     children: [
  //       //       // 子菜单
  //       //     ]
  //       //   },

  //       //   {
  //       //     title: "权限管理",
  //       //     url: routePaths.permissionManagement, // 路由地址
  //       //     children: [
  //       //       // 子菜单
  //       //     ]
  //       //   },
  //       //   {
  //       //     title: "角色&权限",
  //       //     url: routePaths.rolePermission, // 路由地址
  //       //     children: [
  //       //       // 子菜单
  //       //     ]
  //       //   },
  //       //   {
  //       //     title: "用户&角色",
  //       //     url: routePaths.userRole, // 路由地址
  //       //     children: [
  //       //       // 子菜单
  //       //     ]
  //       //   }
  //       // ]
  //     }
  //   ]
  // },
 
];
