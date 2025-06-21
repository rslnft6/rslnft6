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

  // البحث الذكي
  const handleSmartSearch = (q: string) => {
    setSearch(q);
    setFiltered(smartSearch(q, properties));
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
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <div>
            <button onClick={()=>push('/', undefined, { locale: 'ar' })} style={{background:locale==='ar'?'#00bcd4':'#eee',color:locale==='ar'?'#fff':'#222',border:'none',borderRadius:8,padding:'6px 16px',fontWeight:'bold',fontSize:16,minWidth:110}}>
              العربية
            </button>
            <button onClick={()=>push('/', undefined, { locale: 'en' })} style={{background:locale==='en'?'#00bcd4':'#eee',color:locale==='en'?'#fff':'#222',border:'none',borderRadius:8,padding:'6px 16px',fontWeight:'bold',fontSize:16,minWidth:110,marginLeft:8}}>
              English
            </button>
          </div>
          <button onClick={()=>window.location.href='/login'} style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',fontSize:16,cursor:'pointer'}}>
            تسجيل الدخول
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
            <VoiceSearch onResult={text => handleFilterChange('search', text)} />
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
            <VRView />
          </div>
          <h1 className="section-title">معرض صور بانوراما 360°</h1>
          <VR360Gallery />
          <Reviews />
          <VideoTour />
          <StatsBox />
          {/* <AdminPanel /> تم إزالته من الصفحة الرئيسية */}
        </main>
      </div>
      <footer style={{background:'#f5f7fa',color:'#222',padding:'32px 0 16px 0',marginTop:40}}>
  <div className="footer" style={{display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap',alignItems:'center'}}>
    <button onClick={()=>window.location.href='/admin'} style={{background:'#ff9800',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold',fontSize:18,cursor:'pointer',marginBottom:8}}>لوحة التحكم</button>
    <button onClick={()=>window.location.href='/partners'} style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold',fontSize:18,cursor:'pointer',marginBottom:8}}>شركاؤنا</button>
    <button onClick={()=>window.location.href='/about'} style={{background:'#00e676',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold',fontSize:18,cursor:'pointer',marginBottom:8}}>من نحن</button>
    <button onClick={()=>window.location.href='/login'} style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold',fontSize:18,cursor:'pointer',marginBottom:8}}>تسجيل الدخول</button>
    <button onClick={()=>window.location.href='/dev-panel'} style={{background:'#673ab7',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold',fontSize:18,cursor:'pointer',marginBottom:8}}>لوحة تحكم المطورين</button>
  </div>
  <div style={{textAlign:'center',marginTop:24,color:'#00bcd4',fontSize:16,fontWeight:'bold'}}>
    <img src="/globe.svg" alt="logo" style={{width:32,verticalAlign:'middle',marginRight:8}} />
    جميع الحقوق محفوظة The team one world criptoman © {new Date().getFullYear()}
  </div>
</footer>
    </div>
  );
}
