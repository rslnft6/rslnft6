import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      welcome: 'مرحباً بك في تطبيق العقارات العالمي',
      available: 'متاح',
      sold: 'مباع',
      details: 'تفاصيل',
      map: 'الخريطة',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      slider_properties: 'الوحدات الأكثر مشاهدة',
      slider_projects: 'مشروعات تحت التنفيذ',
      // ... أضف المزيد حسب الحاجة
    },
  },
  en: {
    translation: {
      welcome: 'Welcome to the Global Real Estate App',
      available: 'Available',
      sold: 'Sold',
      details: 'Details',
      map: 'Map',
      login: 'Login',
      logout: 'Logout',
      slider_properties: 'Most Viewed Properties',
      slider_projects: 'Ongoing Projects',
      // ... add more as needed
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
