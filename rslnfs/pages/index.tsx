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

  // البحث الذكي
  const handleSmartSearch = (q: string) => {
    setSearch(q);
    setFiltered(smartSearch(q, properties));
  };

  // فلترة الوحدات حسب البحث
  const filteredProperties = properties.filter(p =>
    (!search || (p.title && p.title.includes(search)) || (p.location && p.location.includes(search))) &&
    (!type || p.type === type) &&
    (!country || (p.location && p.location.includes(country))) &&
    (!compound || p.compound === compound) &&
    (!developer || p.developer === developer) &&
    (!finance || (finance === 'تمويل عقاري' ? p.finance === 'تمويل عقاري' : true)) &&
    (!purpose || p.purpose === purpose) // تحديث الفلترة لتشمل الغرض
  );

  useEffect(() => {
    if (filtered.length > 0 && search.length > 2) {
      notifyUser('نتيجة بحث جديدة', `تم العثور على ${filtered.length} وحدة تناسب بحثك!`);
    }
  }, [filtered, search]);

  return (
    <div className="container" style={{
      backgroundImage: `url(${backgrounds[0]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      borderRadius: 24,
      boxShadow: '0 2px 32px rgba(0,0,0,0.08)'
    }}>
      <>
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
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <button onClick={()=>push('/', undefined, { locale: 'ar' })} style={{background:locale==='ar'?'#00bcd4':'#eee',color:locale==='ar'?'#fff':'#222',border:'none',borderRadius:8,padding:'6px 16px',fontWeight:'bold'}}>العربية</button>
            <button onClick={()=>push('/', undefined, { locale: 'en' })} style={{background:locale==='en'?'#00bcd4':'#eee',color:locale==='en'?'#fff':'#222',border:'none',borderRadius:8,padding:'6px 16px',fontWeight:'bold'}}>English</button>
          </div>
          <main>
            {/* إضافة شعار baitkvr عالمي أعلى الصفحة */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',margin:'32px 0 16px 0'}}>
              <img src="/images/vr-house-logo.png" alt="baitkvr logo" style={{width:60,marginLeft:12}} />
              <span style={{fontWeight:'bold',fontSize:36,color:'#00bcd4',letterSpacing:2,textShadow:'0 2px 8px #e0e0e0'}}>Baitkvr</span>
            </div>
            <h1 className="section-title">{t('slider_properties')}</h1>
            <div className="search-bar" style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 2px 12px #e0e0e0',marginBottom:24,flexWrap:'wrap',display:'flex',gap:8}}>
              <VoiceSearch onResult={handleSmartSearch} />
              <input placeholder="بحث عن وحدة..." value={search} onChange={e => handleSmartSearch(e.target.value)} style={{fontSize:18,border:'1px solid #00bcd4',borderRadius:8,padding:8,marginLeft:8,minWidth:160,flex:'1 1 120px'}} />
              <select value={type} onChange={e => setType(e.target.value)} style={{color:'#00bcd4',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
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
              <select value={country} onChange={e => setCountry(e.target.value)} style={{color:'#ff9800',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
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
              <select value={compound} onChange={e => setCompound(e.target.value)} style={{color:'#00e676',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
                <option value="">كل الكمباوندات</option>
                {compounds.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <select value={developer} onChange={e => setDeveloper(e.target.value)} style={{color:'#2196f3',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
                <option value="">كل المطورين</option>
                {developers.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
              <select value={finance} onChange={e => setFinance(e.target.value)} style={{color:'#ff1744',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
                <option value="">كل خيارات التمويل</option>
                <option value="تمويل عقاري">تمويل عقاري</option>
                <option value="نقدي">نقدي</option>
              </select>
              {/* إضافة فلترة للبيع/إيجار */}
              <select value={purpose} onChange={e => setPurpose(e.target.value)} style={{color:'#ff9800',fontWeight:'bold',marginLeft:8,minWidth:120,flex:'1 1 120px'}}>
                <option value="">الكل</option>
                <option value="للبيع">للبيع</option>
                <option value="للإيجار">للإيجار</option>
              </select>
              <button onClick={()=>window.location.href='/login'} style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',fontSize:16,marginLeft:8,cursor:'pointer'}}>تسجيل الدخول</button>
            </div>
            {/* سلايدر الوحدات الأكثر مشاهدة */}
            <h1 className="section-title" style={{color:'#ff9800',fontWeight:'bold',fontSize:28,marginTop:24,display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
              <img src="/images/vr-house-logo.png" alt="baitkvr logo" style={{width:48}} />
              الوحدات الأكثر مشاهدة
            </h1>
            <Swiper spaceBetween={12} slidesPerView={2} style={{marginBottom: 32}}>
              {filtered.slice(0, 10).map((property) => (
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
            <h1 className="section-title">{t('slider_projects')}</h1>
            <Swiper spaceBetween={16} slidesPerView={2} style={{marginBottom: 40}}>
              {projects.map((project) => (
                <SwiperSlide key={project.id}>
                  <div className="card">
                    <img src={project.image} alt={project.name} style={{width: '100%', height: 180, objectFit: 'cover', borderRadius: 12}} />
                    <div className="property-details">
                      <h3>{project.name}</h3>
                      <span className="status-badge" style={{background:'#ff9800'}}>تحت التنفيذ</span>
                      <span>{project.country}</span>
                      <span>{project.details}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <h1 className="section-title">خريطة العقارات</h1>
            <div className="map-section">
              <MapView />
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
      </>
    </div>
  );
}
