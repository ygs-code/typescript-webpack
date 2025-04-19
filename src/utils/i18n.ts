import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '@/locales/en.json';
import zhTranslation from '@/locales/zh.json';
import hkTranslation from '@/locales/hk.json';
// 引入HOC高阶函数 withTranslation 和 i18n 的ts类型定义 WithTranslation
// import {withTranslation, WithTranslation  ,useTranslation} from 'react-i18next';
// const { t } = useTranslation();
//   const { t } = props;

export const setLanguage = (language: string):string => {
  // 设置语言
  localStorage.setItem('language', language);

  return language;
};


// 根据浏览器获取语言
export const getLanguage = (): string => {
  let userLanguage = window.navigator.language || window.navigator.languages[0];

  let language = localStorage.getItem('language');

  userLanguage = ['en', 'zh', 'hk'].find((item) => {
    return userLanguage.search(item) !== -1;
  });

  language = language || userLanguage;

  return language;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    zh: { translation: zhTranslation },
    hk: { translation: hkTranslation },
  },
  lng: setLanguage(getLanguage()), // 默认语言
  interpolation: { escapeValue: false },
});

export default i18n;
