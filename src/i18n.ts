import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    // Add all supported languages here if you want to preload or restrict
    supportedLngs: ['en', 'hi', 'es', 'fr', 'zh', 'ar', 'pt', 'ru', 'ja', 'de', 'ko', 'it', 'tr', 'vi', 'pl', 'nl', 'id', 'th', 'bn', 'pa', 'mr', 'te', 'ta', 'ur', 'fa', 'sw', 'kn', 'ml'],
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
