
import en from "@/locales/en.json";
import hk from "@/locales/hk.json";
import zh from "@/locales/zh.json";
// 语言包
export const getLanguageMessages = (lang: string, langKey: string) => {
    switch (lang) {
        case "en":
            return en[langKey];
        case "hk":
            return hk[langKey];
        case "zh":
            return zh[langKey];
        default:
            return zh[langKey]||'';
    }
}

 