import { useEffect, useState } from 'react';
console.log('=== AdminPanel.tsx Mounted ===');
let debugStep = 'AdminPanel mounted';
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
  const [tab, setTab] = useState('الوحدات');
  const [units, setUnits] = useState<any[]>([]);
  const [unitForm, setUnitForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  // المستخدمون (موظفين/مطورين/بروكر/تمويل)
  const [users, setUsers] = useState<any[]>([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'موظف' });
  const [userLoading, setUserLoading] = useState(false);
  // المطورين
  const [devs, setDevs] = useState<any[]>([]);
  const [devForm, setDevForm] = useState({ name: '', logo: '', country: '' });
  const [devLoading, setDevLoading] = useState(false);

  // جلب الوحدات من Firestore
  useEffect(() => {
    async function fetchUnits() {
      setLoading(true);
      try {
        // جلب الوحدات من Firestore
        const res = await fetch('/api/units'); // تحتاج API جاهز أو استخدم Firestore مباشرة هنا
        if (res.ok) {
          const data = await res.json();
          setUnits(data.units || []);
        } else {
          setUnits([]);
        }
      } catch {
        setUnits([]);
      }
      setLoading(false);
    }
    fetchUnits();
  }, []);

  // إضافة وحدة جديدة إلى Firestore
  const handleAddUnit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addUnit({
        title: unitForm.title,
        type: unitForm.type,
        details: unitForm.details
      });
      setUnitForm(initialForm);
      alert('تمت إضافة الوحدة بنجاح!');
    } catch (err: any) {
      alert('حدث خطأ أثناء الإضافة: ' + (err?.message || ''));
    }
    setLoading(false);
  };

  // إضافة مستخدم جديد مع تفعيل الدخول (Firestore + Authentication)
  const handleAddUser = async (e: any) => {
    e.preventDefault();
    setUserLoading(true);
    try {
      await addEmployeeWithAuth({
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role
      });
      setUserForm({ name: '', email: '', password: '', role: 'موظف' });
      alert('تم إضافة المستخدم وتفعيله بنجاح!');
    } catch (err: any) {
      alert('حدث خطأ أثناء إضافة المستخدم: ' + (err?.message || ''));
    }
    setUserLoading(false);
  };

  // جلب المطورين من Firestore (مؤقتًا بيانات محلية)
  useEffect(() => {
    // TODO: استبدل بجلب من Firestore
    setDevs(developers);
  }, []);

  // إضافة مطور جديد (مستقبلاً: أضف إلى Firestore)
  const handleAddDev = (e: any) => {
    e.preventDefault();
    setDevs((d: any[]) => [...d, { ...devForm, id: Date.now() }]);
    setDevForm({ name: '', logo: '', country: '' });
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
        <div style={{fontSize:22,color:'#00bcd4',fontWeight:'bold',marginBottom:16}}>{tab}</div>
        {/* تفعيل قسم الوحدات */}
        {tab==='الوحدات' && (
          <div>
            <form onSubmit={handleAddUnit} style={{marginBottom:24}}>
              <input value={unitForm.title} onChange={e=>setUnitForm(f=>({...f,title:e.target.value}))} placeholder="اسم الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.type} onChange={e=>setUnitForm(f=>({...f,type:e.target.value}))} placeholder="نوع الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.details} onChange={e=>setUnitForm(f=>({...f,details:e.target.value}))} placeholder="تفاصيل" style={{margin:4,padding:8,borderRadius:8}} required />
              <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}} disabled={loading}>إضافة وحدة</button>
            </form>
            {loading && <div style={{color:'#00bcd4'}}>جاري التحميل...</div>}
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {units.map((u,i)=>(
                <div key={i} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:220,maxWidth:260}}>
                  <b style={{color:u.fontColor,fontSize:u.fontSize}}>{u.title}</b>
                  <div>النوع: {u.type}</div>
                  <div>تفاصيل: {u.details}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* تفعيل قسم المستخدمون */}
        {tab==='المستخدمون' && (
          <div>
            <h4>إضافة مستخدم جديد مع تفعيل الدخول (Firestore + Authentication)</h4>
            <form onSubmit={handleAddUser} style={{marginBottom:24}}>
              <input value={userForm.name} onChange={e=>setUserForm(f=>({...f,name:e.target.value}))} placeholder="اسم المستخدم" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={userForm.email} onChange={e=>setUserForm(f=>({...f,email:e.target.value}))} placeholder="البريد الإلكتروني" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={userForm.password} onChange={e=>setUserForm(f=>({...f,password:e.target.value}))} type="password" placeholder="كلمة المرور" style={{margin:4,padding:8,borderRadius:8}} required />
              <select value={userForm.role} onChange={e=>setUserForm(f=>({...f,role:e.target.value}))} style={{margin:4,padding:8,borderRadius:8}} required>
                <option value="موظف">موظف</option>
                <option value="مدير">مدير</option>
                <option value="مطور">مطور</option>
                <option value="بروكر">بروكر</option>
                <option value="تمويل">تمويل</option>
              </select>
              <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}} disabled={userLoading}>إضافة مستخدم وتفعيل الدخول</button>
            </form>
            <div style={{color:'#888',fontSize:18}}>سيتم عرض قائمة المستخدمين قريبًا...</div>
          </div>
        )}
        {/* تفعيل قسم المطورين */}
        {tab==='المطورين' && (
          <div>
            <h4>إضافة مطور جديد</h4>
            <form onSubmit={handleAddDev} style={{marginBottom:24}}>
              <input value={devForm.name} onChange={e=>setDevForm(f=>({...f,name:e.target.value}))} placeholder="اسم المطور" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={devForm.country} onChange={e=>setDevForm(f=>({...f,country:e.target.value}))} placeholder="الدولة" style={{margin:4,padding:8,borderRadius:8}} required />
              <input type="file" accept="image/*" onChange={e=>{
                const file = e.target.files?.[0];
                if (file) setDevForm(f=>({...f,logo:URL.createObjectURL(file)}));
              }} style={{margin:4}} />
              {devForm.logo && <img src={devForm.logo} alt="logo" style={{width:40,verticalAlign:'middle',marginRight:8}} />}
              <button type="submit" style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',marginTop:8,cursor:'pointer'}}>إضافة المطور</button>
            </form>
            <h4 style={{marginTop:24}}>قائمة المطورين</h4>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {devs.map((d:any) => (
                <div key={d.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:180,maxWidth:220}}>
                  <img src={d.logo} alt="logo" style={{width:40,marginBottom:8}} />
                  <div><b>{d.name}</b></div>
                  <div>{d.country}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* باقي الأقسام: الكمباوندات، الإعلانات، الإعدادات... */}
        {tab!=='الوحدات' && tab!=='المستخدمون' && tab!=='المطورين' && <div style={{color:'#888',fontSize:18}}>سيتم تفعيل هذا القسم قريبًا...</div>}
      </div>
      <div>
        <div style={{color:'#888',marginBottom:8}}>Debug: {debugStep}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
