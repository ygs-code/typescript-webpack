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
import cn from 'classnames';


const LogInPage: React.FC<WithTranslation> = (props) => {
  //视口宽度
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    let data = await AccountInfo()



  }
  useEffect(() => {
    init()
  }, [])



  return (
    <div className='log-in'>
      <Header
        style={{
          minWidth: '900px'
        }}
      ></Header>
      <div className={ isMobile ? 'middle-mobile' : 'middle-pc' }>
        <div />
        {/* 表单 */}
        <div>
          <div className='form-box'>
            <div>
              <div className='title'>{t('Pages.login.title')}</div>
              <Form
                formName="login"
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