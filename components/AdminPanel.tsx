import { useEffect, useState } from 'react';
import { compounds } from '../data/compounds';
import { developers } from '../data/developers';
import { getAllProperties } from '../data/properties';
import ExportCSV from './ExportCSV';
import { FaHome, FaBuilding, FaUsers, FaBullhorn, FaCogs, FaUserTie } from 'react-icons/fa';
import { addEmployee, addUnit, addEmployeeWithAuth } from '../services/firestoreActions';

const initialForm = {
  title: '',
  type: '',
  developer: '',
  compound: '',
  owner: '',
  area: '',
  rooms: '',
  baths: '',
  pool: false,
  garden: false,
  contact: '',
  fontColor: '#222',
  fontSize: 18,
  model3d: '',
  panorama360: [],
  sliderImages: [],
  details: '',
};

const TABS = [
  { key: 'الوحدات', label: 'الوحدات', icon: <FaHome /> },
  { key: 'المطورين', label: 'المطورين', icon: <FaUserTie /> },
  { key: 'الكمباوندات', label: 'الكمباوندات', icon: <FaBuilding /> },
  { key: 'الإعلانات', label: 'الإعلانات', icon: <FaBullhorn /> },
  { key: 'المستخدمون', label: 'المستخدمون', icon: <FaUsers /> },
  { key: 'الإعدادات', label: 'الإعدادات', icon: <FaCogs /> },
];

const AdminPanel: React.FC = () => {
  const [form, setForm] = useState<any>(initialForm);
  const [units, setUnits] = useState<any[]>([]);
  const [tab, setTab] = useState('الوحدات');

  // مزامنة الوحدات مع التخزين المحلي
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('units');
    if (saved) setUnits(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('units', JSON.stringify(units));
  }, [units]);

  // تحديث بيانات التطبيق مباشرة
  useEffect(() => {
    (getAllProperties as any).push(...units);
  }, [units]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((f: any) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFile = (e: any, key: string) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file: any) => URL.createObjectURL(file));
    setForm((f: any) => ({ ...f, [key]: [...(f[key] || []), ...urls] }));
  };

  const handleAddUnit = () => {
    setUnits((u) => [...u, form]);
    setForm(initialForm);
  };

  // بيانات المطورين (localStorage)
  const [devForm, setDevForm] = useState({ name: '', logo: '', country: '' });
  const [devs, setDevs] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('developers');
    if (saved) setDevs(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('developers', JSON.stringify(devs));
  }, [devs]);
  const handleDevChange = (e: any) => {
    const { name, value } = e.target;
    setDevForm((f) => ({ ...f, [name]: value }));
  };
  const handleDevFile = (e: any) => {
    const file = e.target.files?.[0];
    if (file) setDevForm((f) => ({ ...f, logo: URL.createObjectURL(file) }));
  };
  const handleAddDev = () => {
    setDevs((d) => [...d, { ...devForm, id: Date.now() }]);
    setDevForm({ name: '', logo: '', country: '' });
  };
  const handleDeleteDev = (id: number) => setDevs((d) => d.filter((dev) => dev.id !== id));

  // بيانات الكمباوندات (localStorage)
  const [compoundForm, setCompoundForm] = useState({ name: '', logo: '', developer: '', city: '', country: '' });
  const [compoundList, setCompoundList] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('compounds');
    if (saved) setCompoundList(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('compounds', JSON.stringify(compoundList));
  }, [compoundList]);
  const handleCompoundChange = (e: any) => {
    const { name, value } = e.target;
    setCompoundForm((f) => ({ ...f, [name]: value }));
  };
  const handleCompoundFile = (e: any) => {
    const file = e.target.files?.[0];
    if (file) setCompoundForm((f) => ({ ...f, logo: URL.createObjectURL(file) }));
  };
  const handleAddCompound = () => {
    setCompoundList((c) => [...c, { ...compoundForm, id: Date.now() }]);
    setCompoundForm({ name: '', logo: '', developer: '', city: '', country: '' });
  };
  const handleDeleteCompound = (id: number) => setCompoundList((c) => c.filter((comp) => comp.id !== id));

  // بيانات الإعلانات (localStorage)
  const [adForm, setAdForm] = useState({ title: '', image: '', link: '' });
  const [ads, setAds] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('ads');
    if (saved) setAds(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ads', JSON.stringify(ads));
  }, [ads]);
  const handleAdChange = (e: any) => {
    const { name, value } = e.target;
    setAdForm((f) => ({ ...f, [name]: value }));
  };
  const handleAdFile = (e: any) => {
    const file = e.target.files?.[0];
    if (file) setAdForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
  };
  const handleAddAd = () => {
    setAds((a) => [...a, { ...adForm, id: Date.now() }]);
    setAdForm({ title: '', image: '', link: '' });
  };
  const handleDeleteAd = (id: number) => setAds((a) => a.filter((ad) => ad.id !== id));

  // بيانات المستخدمين الجدد (محاكاة)
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    // في التطبيق الحقيقي: اجلب من قاعدة البيانات
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('users');
    if (saved) setUsers(JSON.parse(saved));
    else setUsers([
      { id: 1, name: 'مستخدم تجريبي', email: 'test@demo.com', type: 'عميل', date: '2025-06-09' },
      { id: 2, name: 'مطور جديد', email: 'dev@demo.com', type: 'مطور', date: '2025-06-09' }
    ]);
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // إعدادات عامة (تواصل اجتماعي، من نحن، شركاؤنا)
  const [settings, setSettings] = useState<any>({
    aboutImages: [],
    social: {
      whatsapp: '', phone: '', discord: '', telegram: '', instagram: '', facebook: '', snapchat: '', tiktok: ''
    },
    partners: []
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);
  const handleSocialChange = (e: any) => {
    const { name, value } = e.target;
    setSettings((s: any) => ({ ...s, social: { ...s.social, [name]: value } }));
  };
  const handleAboutImages = (e: any) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file: any) => URL.createObjectURL(file));
    setSettings((s: any) => ({ ...s, aboutImages: [...(s.aboutImages || []), ...urls].slice(0,5) }));
  };
  const handleAddPartner = (e: any) => {
    e.preventDefault();
    const name = e.target.partnerName.value;
    const logo = e.target.partnerLogo.files[0] ? URL.createObjectURL(e.target.partnerLogo.files[0]) : '';
    setSettings((s: any) => ({ ...s, partners: [...(s.partners || []), { name, logo }] }));
    e.target.reset();
  };

  return (
    <div style={{display:'flex',gap:32,minHeight:600}}>
      {/* الشريط الجانبي */}
      <div style={{minWidth:180,background:'#f5f7fa',borderRadius:16,padding:'24px 0',boxShadow:'0 2px 12px #e0e0e0',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <div style={{fontWeight:'bold',fontSize:22,color:'#00bcd4',marginBottom:16}}>لوحة التحكم</div>
        {TABS.map(t => (
          <button key={t.key} onClick={()=>setTab(t.key)} style={{
            background:tab===t.key?'#00bcd4':'#fff',
            color:tab===t.key?'#fff':'#222',
            border:'none',
            borderRadius:8,
            padding:'10px 18px',
            fontWeight:'bold',
            fontSize:17,
            cursor:'pointer',
            width:'90%',
            display:'flex',
            alignItems:'center',
            gap:10,
            boxShadow:tab===t.key?'0 2px 8px #b2ebf2':'none',
            transition:'all 0.2s'
          }}>{t.icon}<span>{t.label}</span></button>
        ))}
      </div>
      {/* محتوى لوحة التحكم */}
      <div style={{background:'#fff',borderRadius:16,padding:24,boxShadow:'0 2px 16px #e0e0e0',flex:1,minWidth:320}}>
        {tab==='الوحدات' && (
          <div>
            <div style={{display:'flex',flexWrap:'wrap',gap:24}}>
              <div style={{flex:1,minWidth:320}}>
                <h4>إضافة وحدة جديدة (Firestore)</h4>
                <form onSubmit={async e => {
                  e.preventDefault();
                  const title = (e.target as any).unitTitle.value;
                  const type = (e.target as any).unitType.value;
                  const details = (e.target as any).unitDetails.value;
                  await addUnit({ title, type, details });
                  alert('تم إضافة الوحدة بنجاح!');
                  (e.target as any).reset();
                }}>
                  <input name="unitTitle" placeholder="اسم الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
                  <input name="unitType" placeholder="نوع الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
                  <input name="unitDetails" placeholder="تفاصيل" style={{margin:4,padding:8,borderRadius:8}} required />
                  <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}}>إضافة وحدة</button>
                </form>
              </div>
              <div style={{flex:2,minWidth:320}}>
                <h4>الوحدات المضافة (تجريبي)</h4>
                <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
                  {units.map((u, i) => (
                    <div key={i} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:220,maxWidth:260}}>
                      <b style={{color:u.fontColor,fontSize:u.fontSize}}>{u.title}</b>
                      <div>النوع: {u.type}</div>
                      <div>المطور: {u.developer}</div>
                      <div>الكمباوند: {u.compound}</div>
                      <div>المساحة: {u.area} م²</div>
                      <div>الغرف: {u.rooms} | الحمامات: {u.baths}</div>
                      {u.pool && <div>حمام سباحة</div>}
                      {u.garden && <div>جاردن</div>}
                      <div>التواصل: {u.contact}</div>
                      <div>تفاصيل: {u.details}</div>
                      {u.panorama360 && u.panorama360.length > 0 && <img src={u.panorama360[0]} alt="بانوراما" style={{width:'100%',borderRadius:8,margin:'8px 0'}} />}
                      {u.model3d && u.model3d.length > 0 && <span style={{color:'#2196f3'}}>نموذج 3D مرفوع</span>}
                      {u.sliderImages && u.sliderImages.length > 0 && <span style={{color:'#2196f3'}}>صور سلايدر مرفوعة</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ExportCSV />
          </div>
        )}
        {tab==='المطورين' && (
          <div>
            <h4>إضافة مطور جديد</h4>
            <input name="name" placeholder="اسم المطور" value={devForm.name} onChange={handleDevChange} style={{width:'100%',margin:'4px 0'}} />
            <input name="country" placeholder="الدولة" value={devForm.country} onChange={handleDevChange} style={{width:'100%',margin:'4px 0'}} />
            <div style={{margin:'8px 0'}}>لوجو المطور:
              <input type="file" accept="image/*" onChange={handleDevFile} />
              {devForm.logo && <img src={devForm.logo} alt="logo" style={{width:40,verticalAlign:'middle',marginRight:8}} />}
            </div>
            <button onClick={handleAddDev} style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',marginTop:8,cursor:'pointer'}}>إضافة المطور</button>
            <h4 style={{marginTop:24}}>قائمة المطورين</h4>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {devs.map((d) => (
                <div key={d.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:180,maxWidth:220}}>
                  <img src={d.logo} alt="logo" style={{width:40,marginBottom:8}} />
                  <div><b>{d.name}</b></div>
                  <div>{d.country}</div>
                  <button onClick={()=>handleDeleteDev(d.id)} style={{background:'#e53935',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',marginTop:8,cursor:'pointer'}}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==='الكمباوندات' && (
          <div>
            <h4>إضافة كمباوند جديد</h4>
            <input name="name" placeholder="اسم الكمباوند" value={compoundForm.name} onChange={handleCompoundChange} style={{width:'100%',margin:'4px 0'}} />
            <input name="developer" placeholder="المطور" value={compoundForm.developer} onChange={handleCompoundChange} style={{width:'100%',margin:'4px 0'}} />
            <input name="city" placeholder="المدينة" value={compoundForm.city} onChange={handleCompoundChange} style={{width:'100%',margin:'4px 0'}} />
            <input name="country" placeholder="الدولة" value={compoundForm.country} onChange={handleCompoundChange} style={{width:'100%',margin:'4px 0'}} />
            <div style={{margin:'8px 0'}}>لوجو الكمباوند:
              <input type="file" accept="image/*" onChange={handleCompoundFile} />
              {compoundForm.logo && <img src={compoundForm.logo} alt="logo" style={{width:40,verticalAlign:'middle',marginRight:8}} />}
            </div>
            <button onClick={handleAddCompound} style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',marginTop:8,cursor:'pointer'}}>إضافة الكمباوند</button>
            <h4 style={{marginTop:24}}>قائمة الكمباوندات</h4>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {compoundList.map((c) => (
                <div key={c.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:180,maxWidth:220}}>
                  <img src={c.logo} alt="logo" style={{width:40,marginBottom:8}} />
                  <div><b>{c.name}</b></div>
                  <div>{c.developer}</div>
                  <div>{c.city} - {c.country}</div>
                  <button onClick={()=>handleDeleteCompound(c.id)} style={{background:'#e53935',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',marginTop:8,cursor:'pointer'}}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==='الإعلانات' && (
          <div>
            <h4>إضافة إعلان جديد (سلايدر)</h4>
            <input name="title" placeholder="عنوان الإعلان" value={adForm.title} onChange={handleAdChange} style={{width:'100%',margin:'4px 0'}} />
            <input name="link" placeholder="رابط الإعلان (اختياري)" value={adForm.link} onChange={handleAdChange} style={{width:'100%',margin:'4px 0'}} />
            <div style={{margin:'8px 0'}}>صورة الإعلان:
              <input type="file" accept="image/*" onChange={handleAdFile} />
              {adForm.image && <img src={adForm.image} alt="ad" style={{width:60,verticalAlign:'middle',marginRight:8}} />}
            </div>
            <button onClick={handleAddAd} style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',marginTop:8,cursor:'pointer'}}>إضافة الإعلان</button>
            <h4 style={{marginTop:24}}>قائمة الإعلانات</h4>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {ads.map((a) => (
                <div key={a.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:180,maxWidth:220}}>
                  <img src={a.image} alt="ad" style={{width:60,marginBottom:8}} />
                  <div><b>{a.title}</b></div>
                  {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" style={{color:'#2196f3',fontSize:13}}>رابط الإعلان</a>}
                  <button onClick={()=>handleDeleteAd(a.id)} style={{background:'#e53935',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',marginTop:8,cursor:'pointer'}}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==='المستخدمون' && (
          <div>
            <h4>إضافة موظف جديد مع تفعيل الدخول (Firestore + Authentication)</h4>
            <form onSubmit={async e => {
              e.preventDefault();
              const name = (e.target as any).empName.value;
              const email = (e.target as any).empEmail.value;
              const password = (e.target as any).empPassword.value;
              const role = (e.target as any).empRole.value;
              try {
                await addEmployeeWithAuth({ name, email, password, role });
                alert('تم إضافة الموظف وتفعيله بنجاح!');
                (e.target as any).reset();
              } catch (err: any) {
                alert('حدث خطأ أثناء إضافة الموظف: '+(err?.message||''));
              }
            }} style={{marginBottom:24}}>
              <input name="empName" placeholder="اسم الموظف" style={{margin:4,padding:8,borderRadius:8}} required />
              <input name="empEmail" placeholder="البريد الإلكتروني" style={{margin:4,padding:8,borderRadius:8}} required />
              <input name="empPassword" type="password" placeholder="كلمة المرور للموظف" style={{margin:4,padding:8,borderRadius:8}} required />
              <select name="empRole" style={{margin:4,padding:8,borderRadius:8}} required>
                <option value="موظف">موظف</option>
                <option value="مدير">مدير</option>
                <option value="مطور">مدير</option>
                <option value="بروكر">بروكر</option>
                <option value="تمويل">تمويل</option>
              </select>
              <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}}>إضافة موظف وتفعيل الدخول</button>
            </form>
            <h4>قائمة المستخدمين الجدد والمطورين</h4>
            <table style={{width:'100%',margin:'16px 0',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f5f7fa'}}>
                  <th style={{padding:8,border:'1px solid #eee'}}>الاسم</th>
                  <th style={{padding:8,border:'1px solid #eee'}}>البريد</th>
                  <th style={{padding:8,border:'1px solid #eee'}}>النوع</th>
                  <th style={{padding:8,border:'1px solid #eee'}}>تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{padding:8,border:'1px solid #eee'}}>{u.name}</td>
                    <td style={{padding:8,border:'1px solid #eee'}}>{u.email}</td>
                    <td style={{padding:8,border:'1px solid #eee'}}>{u.type}</td>
                    <td style={{padding:8,border:'1px solid #eee'}}>{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* مكان لنظام التسكين الذكي للمطورين لاحقاً */}
            <div style={{marginTop:24,padding:16,background:'#e0eafc',borderRadius:12}}>
              <b>نظام التسكين الذكي للمطورين (قريباً):</b>
              <p style={{margin:'8px 0 0 0',color:'#555'}}>سيتم هنا عرض اقتراحات تسكين الوحدات على المطورين تلقائياً بناءً على الذكاء الاصطناعي واحتياجات السوق.</p>
            </div>
          </div>
        )}
        {tab==='الإعدادات' && (
          <div>
            <h4>من نحن (يمكن رفع حتى 5 صور)</h4>
            <div style={{background:'#e0f7fa',padding:16,borderRadius:12,margin:'8px 0',color:'#00bcd4',fontWeight:'bold',fontSize:18}}>
              منصة Realstatelive هي منصة عقارية عالمية تهدف إلى ربط المطورين والعملاء والبنوك وشركات التمويل في مكان واحد، مع دعم أحدث تقنيات الذكاء الاصطناعي والواقع الافتراضي. نؤمن أن الشفافية وسهولة الوصول للمعلومة هما أساس نجاح السوق العقاري الحديث. هدفنا تمكين الجميع من اتخاذ قرارات أفضل وتحقيق أحلامهم العقارية بسهولة وأمان.
            </div>
            <input type="file" accept="image/*" multiple onChange={handleAboutImages} />
            <div style={{display:'flex',gap:8,margin:'8px 0'}}>
              {settings.aboutImages && settings.aboutImages.map((img:string,i:number)=>(<img key={i} src={img} alt="about" style={{width:60,borderRadius:8}} />))}
            </div>
            <h4>وسائل التواصل الاجتماعي</h4>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              <input name="whatsapp" placeholder="واتساب" value={settings.social.whatsapp} onChange={handleSocialChange} style={{width:120}} />
              <input name="phone" placeholder="رقم الهاتف" value={settings.social.phone} onChange={handleSocialChange} style={{width:120}} />
              <input name="discord" placeholder="Discord" value={settings.social.discord} onChange={handleSocialChange} style={{width:120}} />
              <input name="telegram" placeholder="Telegram" value={settings.social.telegram} onChange={handleSocialChange} style={{width:120}} />
              <input name="instagram" placeholder="Instagram" value={settings.social.instagram} onChange={handleSocialChange} style={{width:120}} />
              <input name="facebook" placeholder="Facebook" value={settings.social.facebook} onChange={handleSocialChange} style={{width:120}} />
              <input name="snapchat" placeholder="Snapchat" value={settings.social.snapchat} onChange={handleSocialChange} style={{width:120}} />
              <input name="tiktok" placeholder="TikTok" value={settings.social.tiktok} onChange={handleSocialChange} style={{width:120}} />
            </div>
            <h4 style={{marginTop:24}}>شركاؤنا (شعار واسم)</h4>
            <form onSubmit={handleAddPartner} style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
              <input name="partnerName" placeholder="اسم الشريك" style={{width:160}} />
              <input name="partnerLogo" type="file" accept="image/*" />
              <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'6px 16px',fontWeight:'bold',cursor:'pointer'}}>إضافة</button>
            </form>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {settings.partners && settings.partners.map((p:any,i:number)=>(
                <div key={i} style={{border:'1px solid #eee',borderRadius:8,padding:8,minWidth:120,maxWidth:160,textAlign:'center'}}>
                  {p.logo && <img src={p.logo} alt={p.name} style={{width:40,marginBottom:4}} />}
                  <div>{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* لوحة تحكم CRM للمطورين (مخطط أولي) */}
        {/* سيتم تطويرها لاحقاً لإدارة العملاء والطلبات والتواصل مع العملاء */}
      </div>
    </div>
  );
};

export default AdminPanel;
