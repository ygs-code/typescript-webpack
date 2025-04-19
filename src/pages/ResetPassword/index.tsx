import 'src/assets/css/base.scss';
import './index.scss';
import { Tabs, TabsProps } from 'antd';
import { mapRedux } from '@/redux';
import { addRouterApi, Link } from 'src/router';
import React from 'react';
import loginImg from '@/assets/images/404.png';
import VerificationCodeLogin from '@/components/VerificationCodeLogin';
import { MailTwoTone } from '@ant-design/icons';
import Header from '@/components/Header';
import Token from "src/apis/request/token";
import { getToken, GetUserInfo } from "@/apis";
import Form from './components/Form';
import { useEffect, useState } from 'react';
// 引入HOC高阶函数 withTranslation 和 i18n 的ts类型定义 WithTranslation
import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';


const LogInPage: React.FC<WithTranslation> = (props) => {

  const [procedure, setProcedure] = useState(1)

  const { t } = useTranslation();
  const AccountInfo = async () => {
    // 如果已经登录了 则跳去首页
    let { data } = await GetUserInfo(
      {},
      {
        requestOptions: {
          globalErrorMessage: false,
          // 默认全局展示请求成功信息
          globalSuccessMessage: false,
          globalErrorRedirect: false
        }
      }
    )
    // dispatch(actions.user_setUser(data))

  }
  // const items: TabsProps['items'] = [
  //   {
  //     key: 'email',
  //     label: '邮箱登录',
  //     children: <VerificationCodeLogin type='email' size='large' placeholder='请输入邮箱地址' prefix={<MailTwoTone className={"prefixIcon"} />} />
  //   },
  //   {
  //     key: 'phone',
  //     label: '手机号登录',
  //     children: <VerificationCodeLogin type='phone' size='large' placeholder='请输入手机号' />
  //   }

  // ];



  const init = async () => {  // 初始化 

    const token = await Token.get()

    if (!token) {
      getToken()
    }

    // let data = await AccountInfo()



  }
  useEffect(() => {
    init()
  }, [])



  return (
    <div className='log-in'>
      <div className='log-in-header'>
        <Header
          style={{
            minWidth: '900px'
          }}
        ></Header>
      </div>

      <div className='middle'>
        <div> </div>
        {/* 表单 */}
        <div>
          <div className='form-box'>
            <div>
              <div className='title'>
                {procedure == 1 ? t('Pages.login.retrievePassword') : t('Pages.login.changePassword')}
              </div>


              <Form formName="loginForm" onChangeProcedure={(v: number) => {
                setProcedure(v)
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default  mapRedux()(
  addRouterApi(withTranslation()(LogInPage))
);