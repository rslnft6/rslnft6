import { useEffect, useState } from 'react';
import { compounds } from '../data/compounds';
import { developers } from '../data/developers';
import { getAllProperties } from '../data/properties';
import ExportCSV from './ExportCSV';

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

const TABS = ['الوحدات', 'المطورين', 'الكمباوندات', 'الإعلانات', 'المستخدمون'];

const AdminPanel: React.FC = () => {
  const [form, setForm] = useState<any>(initialForm);
  const [units, setUnits] = useState<any[]>([]);
  const [tab, setTab] = useState('الوحدات');

  // مزامنة الوحدات مع التخزين المحلي
  useEffect(() => {
    const saved = localStorage.getItem('units');
    if (saved) setUnits(JSON.parse(saved));
  }, []);
  useEffect(() => {
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
    const saved = localStorage.getItem('developers');
    if (saved) setDevs(JSON.parse(saved));
  }, []);
  useEffect(() => {
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
    const saved = localStorage.getItem('compounds');
    if (saved) setCompoundList(JSON.parse(saved));
  }, []);
  useEffect(() => {
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
    const saved = localStorage.getItem('ads');
    if (saved) setAds(JSON.parse(saved));
  }, []);
  useEffect(() => {
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
    const saved = localStorage.getItem('users');
    if (saved) setUsers(JSON.parse(saved));
    else setUsers([
      { id: 1, name: 'مستخدم تجريبي', email: 'test@demo.com', type: 'عميل', date: '2025-06-09' },
      { id: 2, name: 'مطور جديد', email: 'dev@demo.com', type: 'مطور', date: '2025-06-09' }
    ]);
  }, []);
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  return (
    <div style={{background:'#fff',borderRadius:16,padding:24,boxShadow:'0 2px 16px #e0e0e0',margin:'32px 0'}}>
      <div style={{display:'flex',gap:16,marginBottom:24}}>
        {TABS.map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?'#00bcd4':'#eee',color:tab===t?'#fff':'#222',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',fontSize:18,cursor:'pointer'}}>{t}</button>
        ))}
      </div>
      {tab==='الوحدات' && (
        <div>
          <div style={{display:'flex',flexWrap:'wrap',gap:24}}>
            <div style={{flex:1,minWidth:320}}>
              <h4>إضافة وحدة جديدة</h4>
              <input name="title" placeholder="اسم الوحدة" value={form.title} onChange={handleChange} style={{width:'100%',margin:'4px 0'}} />
              <select name="type" value={form.type} onChange={handleChange} style={{width:'100%',margin:'4px 0'}}>
                <option value="">نوع الوحدة</option>
                <option value="palace">قصر</option>
                <option value="villa">فيلا</option>
                <option value="apartment">شقة</option>
                <option value="clinic">عيادة</option>
                <option value="shop">محل</option>
                <option value="office">مكتب</option>
                <option value="penthouse">بنتهاوس</option>
                <option value="townhouse">تاون هاوس</option>
              </select>
              <select name="developer" value={form.developer} onChange={handleChange} style={{width:'100%',margin:'4px 0'}}>
                <option value="">المطور العقاري</option>
                {developers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
              <select name="compound" value={form.compound} onChange={handleChange} style={{width:'100%',margin:'4px 0'}}>
                <option value="">الكمباوند</option>
                {compounds.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <input name="owner" placeholder="اسم المالك (اختياري)" value={form.owner} onChange={handleChange} style={{width:'100%',margin:'4px 0'}} />
              <input name="area" placeholder="المساحة (م²)" value={form.area} onChange={handleChange} style={{width:'100%',margin:'4px 0'}} />
              <input name="rooms" placeholder="عدد الغرف" value={form.rooms} onChange={handleChange} style={{width:'100%',margin:'4px 0'}} />
              <input name="baths" placeholder="عدد الحمامات" value={form.baths} onChange={handleChange} style={{width:'100%',margin:'4px 0'}} />
              <label><input type="checkbox" name="pool" checked={form.pool} onChange={handleChange} /> حمام سباحة</label>
              <label><input type="checkbox" name="garden" checked={form.garden} onChange={handleChange} /> جاردن</label>
              <input name="contact" placeholder="بيانات التواصل" value={form.contact} onChange={handleChange} style={{width:'100%',margin:'4px 0'}} />
              <input name="details" placeholder="تفاصيل إضافية" value={form.details} onChange={handleChange} style={{width:'100%',margin:'4px 0'}} />
              <div style={{margin:'8px 0'}}>صور بانوراما 360:
                <input type="file" accept="image/*" multiple onChange={e => handleFile(e, 'panorama360')} />
              </div>
              <div style={{margin:'8px 0'}}>نماذج 3D (GLB):
                <input type="file" accept=".glb,.gltf,model/gltf-binary" multiple onChange={e => handleFile(e, 'model3d')} />
              </div>
              <div style={{margin:'8px 0'}}>صور السلايدر:
                <input type="file" accept="image/*" multiple onChange={e => handleFile(e, 'sliderImages')} />
              </div>
              <div style={{margin:'8px 0'}}>لون الخط:
                <input type="color" name="fontColor" value={form.fontColor} onChange={handleChange} />
              </div>
              <div style={{margin:'8px 0'}}>حجم الخط:
                <input type="number" name="fontSize" value={form.fontSize} min={10} max={40} onChange={handleChange} />
              </div>
              <button onClick={handleAddUnit} style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',marginTop:12,cursor:'pointer'}}>
                إضافة الوحدة
              </button>
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
      {/* لوحة تحكم CRM للمطورين (مخطط أولي) */}
      {/* سيتم تطويرها لاحقاً لإدارة العملاء والطلبات والتواصل مع العملاء */}
    </div>
  );
};

export default AdminPanel;
