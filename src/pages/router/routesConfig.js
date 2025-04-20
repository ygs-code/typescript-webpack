/*
 * @Date: 2022-08-01 17:29:00
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-08-11 15:55:18
 * @FilePath: /react-loading-ssr/src/router/routesConfig.js
 * @Description:
 */

// 路由配置
export default [
  {
    path: "/",
    exact: false,
    name: "~layout",  // 特殊路由
    entry: "/pages/Layout/index.js",
    level: 1,
  },
  {
    path: "/login",
    exact: true,
    name: "logIn",
    entry: "/pages/LogIn",
    level: 1,
  },
  {
    path: "/register",
    exact: true,
    name: "register",
    entry: "/pages/Register",
    level: 1,
  },
  {
    path: "/reset-password",
    exact: true,
    name: "resetPassword",
    entry: "/pages/ResetPassword",
    level: 1,
  },
  {
    path: "/",
    exact: true,
    name: "index",
    entry: "/pages/Index",
    level: 2
  },
  {
    path: "/account",
    exact: true,
    name: "account",
    entry: "/pages/Account/index",
    level: 2
  },
  {
    path: "/deposit",
    exact: true,
    name: "deposit",
    entry: "/pages/Deposit/index",
    level: 2,
    // children: [
    //   {
    //     path: "/details/:action/:id?",
    //     name: "depositDetails",
    //     entry:
    //       "/pages/Deposit/details",
    //     level: 2,
    //     children: []
    //   }
    // ]
  },
  {
    path: "/withdrawal",
    exact: true,
    name: "withdrawal",
    entry: "/pages/Withdrawal/index",
    level: 2,
  },
  {
    path: "/card-manage",
    exact: true,
    name: "cardManage",
    entry: "/pages/CardManage/index",
    level: 2,
  },
//实名认证
  {
    path: "/personal-info-write",
    exact: true,
    name: "personalInfoWrite",
    entry: "/pages/PersonalInfoWrite/Details/index",
    level: 2,
  },
//实名认证2
  {
    path: "/personal-info-checked",
    exact: true,
    name: "personalInfoChecked",
    entry: "/pages/PersonalInfoChecked/index",
    level: 2,
  },
  {
    path: "/change-password",
    exact: true,
    name: "changePassword",
    entry: "/pages/ChangePassword/index",
    level: 2,
  },
  {
    path: "/trading-order",
    exact: true,
    name: "tradingOrder",
    entry: "/pages/TradingOrder/index",
    level: 2,
  },
  {
    path: "/deposit-and-withdrawal-report",
    exact: true,
    name: "depositAndWithdrawalReport",
    entry: "/pages/DepositAndWithdrawalReport/index",
    level: 2,
  },
  {
    path: "/customer-list",
    exact: true,
    name: "customerList",
    entry: "/pages/LowerLevelCustomers/CustomerList/index",
    level: 2,
  },
  {
    path: "/customer-trading-order",
    exact: true,
    name: "customerTradingOrder",
    entry: "/pages/LowerLevelCustomers/TradingOrder/index",
    level: 2,
  },
  {
    path: "/customer-deposit-and-withdrawal-report",
    exact: true,
    name: "customerDepositAndWithdrawalReport",
    entry: "/pages/LowerLevelCustomers/DepositAndWithdrawalReport/index",
    level: 2,
  },
  {
    path: "/payment-callback/:checkoutId/:chargeId",
    exact: true,
    name: "paymentCallback",
    entry: "/pages/PaymentCallback/index",
    level: 2,
  },



  {
    path: "/decorator",
    exact: true,
    name: "decorator",
    entry: "/pages/Decorator/index",
    level: 1,
  },


 

  {
    path: "/system",
    exact: true,
    name: "system",
    entry: "/pages/system/index.js",
    level: 2,
    children: [
      {
        path: "/demo",
        name: "demo",
        entry: "/pages/system/pages/demo/index.js",
        level: 2,
        children: [
          {
            path: "/details/:action/:id?",
            name: "demoDetails",
            entry:
              "/pages/system/pages/demo/details/index.js",
            level: 2,
            children: []
          }
        ]
      },
    ],
  },
  // {
  //   path: "/demo",
  //   name: "demo",
  //   entry: "/pages/Demo/index.tsx",
  //   level: 1
  // }
];
