import 'src/assets/css/base.scss';
import './index.scss';
import { Tabs, TabsProps } from 'antd';
import { mapRedux } from '@/redux';
import { addRouterApi, Link } from 'src/router';
import React, { useState } from 'react';
import loginImg from '@/assets/images/404.png';
import VerificationCodeLogin from '@/components/VerificationCodeLogin';
import { MailTwoTone } from '@ant-design/icons';
import Header from '@/components/Header';
import Token from "src/apis/request/token";
import { getToken, GetUserInfo } from "@/apis";
import Form from './components/Form';
import { useEffect } from 'react';
// 引入HOC高阶函数 withTranslation 和 i18n 的ts类型定义 WithTranslation
import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';
import ModalConfirm from '@/components/ModalConfirm';

interface LogInPageProps {
  routePaths: { logIn: string };
  pushRoute: (str: string) => void;
}

const LogInPage: React.FC<LogInPageProps> = ({
  pushRoute,
  routePaths,
}) => {





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

  const [isMcOpen, setIsMcOpen] = useState(false)
  const switchMcOpen = () => setIsMcOpen(!isMcOpen)
  const handleOk = () => {
    pushRoute(routePaths.logIn)
    switchMcOpen()
  }


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
              <div className='title'>{t('Pages.login.title')}</div>
              <Form
                formName="registerForm"
                switchMcOpen={switchMcOpen}
              />
              <ModalConfirm 
                isOpen={isMcOpen}
                isShowRightBtn={false}
                switchOpen={switchMcOpen}
                content={t('Components.ModalConfirm.RegistrationSuccessful')}
                handleOk={handleOk}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default mapRedux()(
  addRouterApi(withTranslation()(LogInPage))
);