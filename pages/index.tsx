import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getAllProperties, projects } from "../data/properties";
import dynamic from 'next/dynamic';
const ModelViewer = dynamic(() => import('../components/ModelViewer'), { ssr: false });
import { useTranslation } from 'react-i18next';
import VRView from '../components/VRView';
import { useState, useEffect } from 'react';
import { backgrounds } from '../data/backgrounds';
import { compounds } from '../data/compounds';
import { developers } from '../data/developers';
import VoiceSearch from '../components/VoiceSearch';
import { smartSearch } from '../services/ai';
import Reviews from '../components/Reviews';
import { useRouter } from 'next/router';
import { notifyUser } from '../services/notifications';
import VideoTour from '../components/VideoTour';
import StatsBox from '../components/StatsBox';
import AnimatedBackground from '../components/AnimatedBackground';
import ImagesSlider from '../components/ImagesSlider';
import SmartChat from '../components/SmartChat';
import { db } from '../data/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaUserCircle } from 'react-icons/fa';
import { defaultContacts, ContactLinks } from '../data/contacts';
import { doc as fsDoc, getDoc } from 'firebase/firestore';
import { FaWhatsapp, FaPhone, FaFacebook, FaSnapchatGhost, FaTwitter, FaInstagram, FaTelegram, FaDiscord, FaEnvelope } from 'react-icons/fa';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const MapView = dynamic(() => import('../components/MapView'), { ssr: false });
const VR360Gallery = dynamic(() => import('../components/VR360Gallery'), { ssr: false });

// تعريف نوع الكمباوند الجديد
interface Compound {
  id: number;
  name: string;
  logo?: string;
  developer?: string;
  developerId?: number;
  city?: string;
  country: string;
}

const properties = getAllProperties();

const PANORAMA_IMAGES = [
  '/panorama/pano1.jpg',
  '/panorama/pano2.jpg',
  '/panorama/pano3.jpg',
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const { locale, push } = useRouter();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(properties);
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [compound, setCompound] = useState('');
  const [developer, setDeveloper] = useState('');
  const [finance, setFinance] = useState('');
  const [purpose, setPurpose] = useState(''); // إضافة حالة الفلترة للبيع/إيجار
  const [selectedPanorama, setSelectedPanorama] = useState<string | null>(null);
  const [pendingFilters, setPendingFilters] = useState({
    search: '', type: '', country: '', compound: '', developer: '', finance: '', purpose: ''
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [firebaseUnits, setFirebaseUnits] = useState<any[]>([]);
  const [showPano, setShowPano] = useState<string|null>(null);
  const [showContacts, setShowContacts] = useState(false);

  // البحث الذكي
  const handleSmartSearch = (q: string) => {
    setSearch(q);
    setFiltered(smartSearch(q, properties));
  };

  // البحث الصوتي: عند النتيجة يتم البحث الذكي مباشرة
  const handleVoiceSearch = (text: string) => {
    handleSmartSearch(text);
  };

  // تحديث الفلاتر المؤقتة
  const handleFilterChange = (key: string, value: string) => {
    setPendingFilters(f => ({ ...f, [key]: value }));
  };

  // تطبيق الفلاتر عند الضغط على زر بحث
  const applyFilters = () => {
    setSearch(pendingFilters.search);
    setType(pendingFilters.type);
    setCountry(pendingFilters.country);
    setCompound(pendingFilters.compound);
    setDeveloper(pendingFilters.developer);
    setFinance(pendingFilters.finance);
    setPurpose(pendingFilters.purpose);
  };

  // جلب الوحدات من Firestore
  useEffect(() => {
    async function fetchUnits() {
      const snap = await getDocs(collection(db, 'units'));
      setFirebaseUnits(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchUnits();
  }, []);

  // دمج وحدات فايرستور مع الوحدات المحلية
  const allProperties = [...firebaseUnits, ...properties];
  const filteredProperties = allProperties.filter(p =>
    (!search || (p.title && p.title.includes(search)) || (p.location && p.location.includes(search))) &&
    (!type || p.type === type) &&
    (!country || (p.location && p.location.includes(country))) &&
    (!compound || p.compound === compound) &&
    (!developer || p.developer === developer || p.developerId === developer) &&
    (!finance || (finance === 'تمويل عقاري' ? p.finance === 'تمويل عقاري' : true)) &&
    (!purpose || p.purpose === purpose) // تحديث الفلترة لتشمل الغرض
  );

  useEffect(() => {
    if (filtered.length > 0 && search.length > 2) {
      notifyUser('نتيجة بحث جديدة', `تم العثور على ${filtered.length} وحدة تناسب بحثك!`);
    }
  }, [filtered, search]);

  useEffect(() => {
    setPendingFilters({
      search, type, country, compound, developer, finance, purpose
    });
  }, [search, type, country, compound, developer, finance, purpose]);

  // زر اللغة الموحد
  const toggleLang = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    push('/', undefined, { locale: newLang });
  };

  // روابط التواصل
  const [contacts, setContacts] = useState<ContactLinks>(defaultContacts);
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const ref = fsDoc(db, 'settings', 'contacts');
        const snap = await getDoc(ref);
        if (snap.exists()) setContacts(snap.data() as ContactLinks);
      } catch {}
    };
    fetchContacts();
  }, []);

  return (
    <div className="container" style={{
      minHeight: '100vh',
      borderRadius: 24,
      boxShadow: '0 2px 32px rgba(0,0,0,0.08)'
    }}>
      <Head>
        <title>تطبيق عقارات عالمي</title>
        <meta
          name="description"
          content="تصفح أفضل الوحدات والمشروعات العقارية في الوطن العربي"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* هيدر احترافي عالمي */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          padding: '8px 0',
          borderBottom: '1px solid #e0e0e0',
          background: 'rgba(255,255,255,0.95)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* زر اللغة الموحد */}
          <button
            onClick={toggleLang}
            title={i18n.language === 'ar' ? 'English' : 'العربية'}
            style={{
              background: '#fff',
              color: '#00bcd4',
              border: '2px solid #00bcd4',
              borderRadius: '50%',
              width: 44,
              height: 44,
              fontWeight: 'bold',
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #e0e0e0',
              transition: 'all 0.2s',
              marginRight: 8
            }}
          >
            {i18n.language === 'ar' ? 'EN' : 'AR'}
          </button>
          {/* زر تسجيل الدخول الدائري */}
          <button
            onClick={() => window.location.href = '/login'}
            title={t('login') || 'تسجيل الدخول'}
            style={{
              background: '#00bcd4',
              border: 'none',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px #b2ebf2',
              cursor: 'pointer',
              marginLeft: 8
            }}
          >
            <FaUserCircle size={26} color="#fff" />
          </button>
        </div>
        <main>
          {/* شعار Realstatelive أعلى الصفحة */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',margin:'32px 0 8px 0'}}>
            <img src="/images/logo1.png" alt="Realstatelive logo" style={{width:60,marginLeft:12}} />
            <span style={{fontWeight:'bold',fontSize:36,color:'#00bcd4',letterSpacing:2,textShadow:'0 2px 8px #e0e0e0'}}>Realstatelive</span>
          </div>
          {/* شريط إعلانات متحرك بلغات متعددة */}
          <div style={{width:'100%',overflow:'hidden',margin:'0 auto 16px auto',direction:'rtl'}}>
            <div style={{
              display:'inline-block',
              whiteSpace:'nowrap',
              animation:'marquee 30s linear infinite',
              color:'#ff9800',
              fontWeight:'bold',
              fontSize:20,
              padding:'8px 0',
              minWidth:'100%'
            }}>
              <span style={{marginRight:40}}>فرحنا بوجودك معنا!</span>
              <span style={{marginRight:40}}>We are happy to have you!</span>
              <span style={{marginRight:40}}>Nous sommes ravis de vous accueillir!</span>
              <span style={{marginRight:40}}>¡Nos alegra tenerte con nosotros!</span>
              <span style={{marginRight:40}}>سعيدين بلقائك!</span>
              <span style={{marginRight:40}}>Happy to see you!</span>
              <span style={{marginRight:40}}>Heureux de vous voir!</span>
              <span style={{marginRight:40}}>¡Feliz de verte!</span>
            </div>
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
          {/* الفلاتر */}
          <div className="search-bar" style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 2px 12px #e0e0e0',marginBottom:24,flexWrap:'wrap',display:'flex',gap:8}}>
            <VoiceSearch onResult={handleVoiceSearch} />
            <input placeholder="بحث عن وحدة..." value={pendingFilters.search} onChange={e => handleFilterChange('search', e.target.value)} style={{fontSize:18,border:'1px solid #00bcd4',borderRadius:8,padding:8,marginLeft:8,minWidth:160,flex:'1 1 120px'}} />
            <select value={pendingFilters.type} onChange={e => handleFilterChange('type', e.target.value)} style={{color:'#00bcd4',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
              <option value="">الكل</option>
              <option value="palace">قصور</option>
              <option value="villa">فيلات</option>
              <option value="apartment">شقق</option>
              <option value="townhouse">تاون هاوس</option>
              <option value="twinhouse">توين هاوس</option>
              <option value="studio">استوديو</option>
              <option value="chalet">شاليه</option>
              <option value="clinic">عيادات</option>
              <option value="shop">محلات</option>
              <option value="office">مكاتب</option>
            </select>
            <select value={pendingFilters.country} onChange={e => handleFilterChange('country', e.target.value)} style={{color:'#ff9800',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
              <option value="">كل الدول</option>
              <option value="مصر">مصر</option>
              <option value="الإمارات">الإمارات</option>
              <option value="السعودية">السعودية</option>
              <option value="الكويت">الكويت</option>
              <option value="البحرين">البحرين</option>
              <option value="قطر">قطر</option>
              <option value="عمان">عمان</option>
              <option value="الأردن">الأردن</option>
              <option value="الجزائر">الجزائر</option>
              <option value="المغرب">المغرب</option>
            </select>
            <select value={pendingFilters.compound} onChange={e => handleFilterChange('compound', e.target.value)} style={{color:'#00e676',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
              <option value="">كل الكمباوندات</option>
              {compounds.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <select value={pendingFilters.developer} onChange={e => handleFilterChange('developer', e.target.value)} style={{color:'#2196f3',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
              <option value="">كل المطورين</option>
              {developers.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <select value={pendingFilters.finance} onChange={e => handleFilterChange('finance', e.target.value)} style={{color:'#ff1744',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
              <option value="">كل خيارات التمويل</option>
              <option value="تمويل عقاري">تمويل عقاري</option>
              <option value="نقدي">نقدي</option>
            </select>
            <select value={pendingFilters.purpose} onChange={e => handleFilterChange('purpose', e.target.value)} style={{color:'#ff9800',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
              <option value="">الكل</option>
              <option value="للبيع">للبيع</option>
              <option value="للإيجار">للإيجار</option>
            </select>
            <button onClick={applyFilters} style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold',fontSize:16,marginLeft:8,cursor:'pointer'}}>بحث</button>
          </div>
          {/* سلايدر صور متحرك بالعرض */}
          <div style={{width:'100%',overflow:'hidden',margin:'0 auto 24px auto',direction:'ltr'}}>
            <div style={{
              display:'flex',
              gap:24,
              animation:'slider-horizontal 24s linear infinite',
              alignItems:'center',
              minWidth:'100%'
            }}>
              <img src="/images/bg1.png" alt="bg1" style={{height:120,borderRadius:16,boxShadow:'0 2px 8px #e0e0e0'}} />
              <img src="/images/bg2.png" alt="bg2" style={{height:120,borderRadius:16,boxShadow:'0 2px 8px #e0e0e0'}} />
              <img src="/images/bg10.jpg" alt="bg10" style={{height:120,borderRadius:16,boxShadow:'0 2px 8px #e0e0e0'}} />
              {/* تكرار الصور لعمل حلقة مستمرة */}
              <img src="/images/bg1.png" alt="bg1-2" style={{height:120,borderRadius:16,boxShadow:'0 2px 8px #e0e0e0'}} />
              <img src="/images/bg2.png" alt="bg2-2" style={{height:120,borderRadius:16,boxShadow:'0 2px 8px #e0e0e0'}} />
              <img src="/images/bg10.jpg" alt="bg10-2" style={{height:120,borderRadius:16,boxShadow:'0 2px 8px #e0e0e0'}} />
            </div>
          </div>
          <style>{`
            @keyframes slider-horizontal {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          {/* الوحدات الأكثر مشاهدة بناءً على الفلترة */}
          <div style={{display:'flex',alignItems:'center',gap:8,margin:'24px 0 8px 0',justifyContent:'center'}}>
            <img src="/images/logo1.png" alt="logo" style={{width:36}} />
            <span style={{color:'#ff9800',fontWeight:'bold',fontSize:22}}>الوحدات المقترحة لك</span>
            <span style={{background:'#00bcd4',color:'#fff',borderRadius:8,padding:'2px 10px',fontSize:14,marginRight:8}}>ذكاء اصطناعي</span>
          </div>
          <Swiper spaceBetween={12} slidesPerView={2} style={{marginBottom: 32}}>
            {filteredProperties.slice(0, 10).map((property) => (
              <SwiperSlide key={property.id}>
                <div className="card" style={{cursor:'pointer',border:'2px solid #00bcd4',borderRadius:16,boxShadow:'0 2px 12px #e0e0e0'}} onClick={()=>window.location.href=`/property/${property.id}`}> 
                  <img src={property.image} alt={property.title} style={{width: '100%', height: 140, objectFit: 'cover', borderRadius: 12}} />
                  <div className="property-details">
                    <h3 style={{color:'#00bcd4',fontWeight:'bold'}}>{property.title}</h3>
                    <span style={{color:'#ff9800',fontWeight:'bold'}}>{property.location}</span>
                    <span style={{color:'#00e676',fontWeight:'bold'}}>{property.details}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* الدردشة الذكية العائمة */}
          <div style={{position:'fixed',bottom:24,right:24,zIndex:9999}}>
            {!chatOpen && (
              <button onClick={()=>setChatOpen(true)} style={{background:'#00bcd4',border:'none',borderRadius:'50%',width:56,height:56,boxShadow:'0 2px 8px #00bcd4',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                <span style={{fontSize:32,color:'#fff'}}>💬</span>
              </button>
            )}
            {chatOpen && (
              <div style={{position:'relative'}}>
                <button onClick={()=>setChatOpen(false)} style={{position:'absolute',top:-12,right:-12,background:'#e53935',color:'#fff',border:'none',borderRadius:'50%',width:28,height:28,fontWeight:'bold',fontSize:18,cursor:'pointer',zIndex:2}}>×</button>
                <SmartChat />
              </div>
            )}
          </div>
          {/* خريطة العقارات */}
          <h1 className="section-title">خريطة العقارات</h1>
          <div className="map-section" style={{minHeight:400, height:400, width:'100%', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px #e0e0e0', marginBottom:32, background:'#f5f7fa', position:'relative'}}>
            <MapView properties={filteredProperties} />
            <noscript>
              <div style={{color:'#ff1744',fontWeight:'bold',padding:16}}>يرجى تفعيل الجافاسكريبت لعرض الخريطة.</div>
            </noscript>
            <div id="map-fallback" style={{display:'none',color:'#ff1744',fontWeight:'bold',padding:16,position:'absolute',top:0,left:0,right:0,bottom:0,background:'#fff',zIndex:2}}>
              تعذر تحميل الخريطة. تأكد من اتصالك بالإنترنت أو أعد تحميل الصفحة.
            </div>
          </div>
          <h1 className="section-title">تجربة الواقع الافتراضي (VR)</h1>
          <div className="vr-section">
            <VRView src="" />
          </div>
          {/* <Reviews /> */}
          {/* <StatsBox /> */}
          {/* <AdminPanel /> تم إزالته من الصفحة الرئيسية */}
        </main>
      </div>
      <footer style={{background:'#f5f7fa',color:'#222',padding:'32px 0 16px 0',marginTop:40}}>
    <div style={{
      background: 'linear-gradient(90deg,#00bcd4 0%,#2196f3 100%)',
      color: '#fff',
      borderRadius: 16,
      padding: '32px 32px',
      margin: '0 auto',
      maxWidth: 800,
      boxShadow: '0 2px 16px #b2ebf2',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
      letterSpacing: 1
    }}>
      <button onClick={()=>window.location.href='/about'} style={{background:'#fff',color:'#00bcd4',border:'none',borderRadius:8,padding:'14px 36px',fontWeight:'bold',fontSize:24,cursor:'pointer',marginBottom:18}}>من نحن</button>
      <div style={{fontSize:17,fontWeight:'normal',color:'#fff',margin:'16px 0 0 0',lineHeight:1.9}}>
        نحن منصة <span style={{color:'#ffeb3b'}}>Realstatelive</span> الرقمية العقارية الرائدة في الشرق الأوسط، نقدم حلولاً متكاملة تجمع بين الذكاء الاصطناعي، الواقع الافتراضي، الخرائط الذكية، البحث الصوتي، الدردشة الذكية، تصفح ثلاثي الأبعاد، وتكامل مع أحدث تقنيات البلوكتشين.<br/><br/>
        قريبًا: سنطلق أول منصة <b>NFTs</b> عقارية في المنطقة، لربط العقارات في الإمارات والبحرين بالأصول الرقمية، مع إمكانية الدفع بمحافظ البلوكتشين والتعامل الكامل عبر تقنيات Web3.<br/><br/>
        هدفنا أن نكون الخيار الأول لكل من يبحث عن الابتكار والشفافية في السوق العقاري، ونمنحك تجربة عالمية بمعايير شركات التكنولوجيا الكبرى.
      </div>
      <div style={{marginTop:28}}>
        <button onClick={()=>setShowContacts(!showContacts)} style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold',fontSize:18,cursor:'pointer',marginBottom:8}}>تواصل معنا</button>
        {showContacts && (
          <div style={{marginTop:16,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:18}}>
            <a href={`https://wa.me/${contacts.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{color:'#25d366',fontSize:28}} title="واتساب"><FaWhatsapp /></a>
            <a href={`tel:${contacts.phone}`} style={{color:'#fff',fontSize:28}} title="اتصال"><FaPhone /></a>
            <a href={contacts.facebook} target="_blank" rel="noopener noreferrer" style={{color:'#1877f3',fontSize:28}} title="فيسبوك"><FaFacebook /></a>
            <a href={contacts.snapchat} target="_blank" rel="noopener noreferrer" style={{color:'#fffc00',fontSize:28}} title="سناب شات"><FaSnapchatGhost /></a>
            <a href={contacts.twitter} target="_blank" rel="noopener noreferrer" style={{color:'#1da1f2',fontSize:28}} title="تويتر"><FaTwitter /></a>
            <a href={contacts.instagram} target="_blank" rel="noopener noreferrer" style={{color:'#e1306c',fontSize:28}} title="انستجرام"><FaInstagram /></a>
            <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" style={{color:'#0088cc',fontSize:28}} title="تيليجرام"><FaTelegram /></a>
            <a href={contacts.discord} target="_blank" rel="noopener noreferrer" style={{color:'#5865f2',fontSize:28}} title="ديسكورد"><FaDiscord /></a>
            <a href={contacts.gmail} target="_blank" rel="noopener noreferrer" style={{color:'#fff',fontSize:28}} title="Gmail"><FaEnvelope /></a>
          </div>
        )}
      </div>
      <div style={{marginTop:18,fontSize:15,color:'#fff',fontWeight:'normal'}}>
        للتواصل السريع: <a href={`tel:${contacts.phone}`} style={{color:'#ffeb3b',textDecoration:'underline'}}>{contacts.phone}</a> أو واتساب: <a href={`https://wa.me/${contacts.whatsapp}`} style={{color:'#25d366',textDecoration:'underline'}}>{contacts.whatsapp}</a>
      </div>
    </div>
    <div style={{textAlign:'center',marginTop:24,color:'#00bcd4',fontSize:16,fontWeight:'bold'}}>
      <img src="/globe.svg" alt="logo" style={{width:32,verticalAlign:'middle',marginRight:8}} />
      جميع الحقوق محفوظة Realstatelive © {new Date().getFullYear()}
    </div>
  </footer>
    </div>
  );
}
