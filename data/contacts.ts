// بيانات وروابط التواصل الاجتماعي للموقع (تعدل من لوحة التحكم)
export interface ContactLinks {
  whatsapp: string; // رقم فقط
  phone: string;
  facebook: string;
  snapchat: string;
  twitter: string;
  instagram: string;
  telegram: string;
  discord: string;
  gmail: string;
}

export const defaultContacts: ContactLinks = {
  whatsapp: '201234567890',
  phone: '201234567890',
  facebook: 'https://facebook.com/',
  snapchat: 'https://snapchat.com/',
  twitter: 'https://twitter.com/',
  instagram: 'https://instagram.com/',
  telegram: 'https://t.me/',
  discord: 'https://discord.com/',
  gmail: 'mailto:info@realstatelive.com',
};
