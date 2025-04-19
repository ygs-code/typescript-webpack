'use client';

import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import zhHK from 'antd/locale/zh_HK';
// 引入HOC高阶函数 withTranslation 和 i18n 的ts类型定义 WithTranslation
import {
  withTranslation,
  WithTranslation,
  useTranslation,
} from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/en';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, {
  useEffect,
  FC,
  useState,
  Children,
  cloneElement,
  isValidElement,
  use,
} from 'react';
import './index.scss';
import { DownOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Space, theme } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import type { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { mapRedux } from '@/redux';
import { Menu } from 'antd';
import i18n from 'i18next';
import { localStorage } from '@/storage';
// import { getLanguage, setLanguage } from '@/utils/i18n';
const { useToken } = theme;

// import { getCookie, } from "@/utils";

// 引入HOC高阶函数 withTranslation 和 i18n 的ts类型定义 WithTranslation
// import { withTranslation, WithTranslation, useTranslation } from 'react-i18next';

interface LanguageProps {
  state: {
    common: {
      language: string;
    };
  };
  dispatch: {
    common: {
      setLanguage: Function;
    };
  };
}

const Language: FC<LanguageProps> & {
  language?: (locale: string) => Promise<any>;
} = (props) => {
  const {
    state: { common: { language } = {} } = {},
    dispatch: {
      common: { setLanguage },
    },
  } = props;

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState([
    {
      label: <span>English</span>,
      key: 'en',
      onClick: () => {
        $setLanguage('en');
        setOpen(false);
      },
    },
    {
      label: <span>简体中文</span>,
      key: 'zh',
      onClick: () => {
        $setLanguage('zh');
        setOpen(false);
      },
    },
    {
      label: <span>繁体中文</span>,
      key: 'hk',
      onClick: () => {
        $setLanguage('hk');
        setOpen(false);
      },
    },
  ]);
  const { token } = useToken();

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  const menuStyle = {
    boxShadow: 'none',
  };

  const $setLanguage = async (language: string): Promise<void> => {
    setLanguage(language);
    i18n.changeLanguage(language);

    const mapLanguage: { [key: string]: string } = {
      zh: 'zh-cn',
      en: 'en',
      hk: 'zh-hk',
    };
    dayjs.locale(mapLanguage[language]);
    dayjs.extend(updateLocale);
    dayjs.updateLocale(mapLanguage[language], {
      weekStart: 0,
    });
  };

  useEffect(() => {
    $setLanguage(language);
  }, []);

  return (
    <div className="language">
      <div>
        {' '}
        <img className="language-img" src="/static/images/language.svg" />
      </div>
      <div style={{}}>
        <Dropdown
          open={open}
          trigger={['click']}
          dropdownRender={(menu) => {
            return (
              <div style={contentStyle}>
                <ul
                  className="ant-dropdown-menu ant-dropdown-menu-root ant-dropdown-menu-vertical ant-dropdown-menu-light css-var-r17h ant-dropdown-css-var css-var-r17h ant-dropdown-menu-css-var"
                  dir="ltr"
                  role="menu"
                  tabindex="0"
                  data-menu-list="true">
                  {items.map((item, index) => {
                    return (
                      <li
                        onClick={item.onClick}
                        key={index}
                        className="ant-dropdown-menu-item ant-dropdown-menu-item-only-child"
                        role="menuitem"
                        aria-describedby=":r1gj:"
                        data-menu-id="rc-menu-uuid-83039-15-0">
                        <span className="ant-dropdown-menu-title-content">
                          {language === item.key ? (
                            <span className="language-active language-dot">
                              {' '}
                            </span>
                          ) : (
                            <span className={'language-dot'}> </span>
                          )}
                          <span>{item.label}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }}>
          <Space
            onClick={() => {
              setOpen(!open);
            }}>
            {language}
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export const mapLanguage = (locale: string) => {
  return {
    zh: zhCN,
    en: enUS,
    hk: zhHK,
  }[locale];
};

interface LanguageProviderProps {}

interface LanguageProviderProps {
  children: React.ReactNode;
  state: {
    common: {
      language: string;
    };
  };
}

export const LanguageProvider: FC<LanguageProviderProps> = mapRedux()(
  (props: LanguageProviderProps) => {
    const { children, state: { common: { language } = {} } = {} } = props;

    return (
      <>
        {Children.map(children, (child: React.ReactNode) => {
          return React.isValidElement(child)
            ? cloneElement(child as React.ReactElement<any>, {
                ...props,
                locale: mapLanguage(language),
              })
            : child;
        })}
      </>
    );
  }
);

LanguageProvider.displayName = 'LanguageProvider';
Language.displayName = 'Language';

export default mapRedux()(Language);
