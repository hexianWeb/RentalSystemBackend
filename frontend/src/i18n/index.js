import { createI18n } from "vue-i18n";
import EN from "./en";
import ZH from "./zh";
const message = {
  en: {
    ...EN,
  },
  zh: {
    ...ZH,
  },
};

const getCurrentLang = () => {
  const UALang = navigator.language;
  const langCode = UALang.indexOf("zh") !== -1 ? "zh" : "en";
  localStorage.setItem("lang", langCode);
  return langCode;
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getCurrentLang() || "zh",
  message: message,
});

export default i18n;
