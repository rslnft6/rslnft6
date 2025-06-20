import React, { useEffect, useState } from 'react';
import { developers } from '../data/developers';

console.log('=== AdminPanel.tsx Mounted ===');
let debugStep = 'AdminPanel mounted';

const TABS = [
  { key: 'الوحدات', label: 'الوحدات' },
  { key: 'المطورين', label: 'المطورين' },
  { key: 'المستخدمون', label: 'المستخدمون' },
  { key: 'الإعلانات', label: 'الإعلانات' },
  { key: 'الإعدادات', label: 'الإعدادات' },
];

function usePersistedState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);
  return [state, setState] as const;
}

const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState('الوحدات');
  // وحدات محفوظة
  const [units, setUnits] = usePersistedState<any[]>('admin-units', [
    { id: 1, title: 'شقة فاخرة', type: 'شقة', details: '3 غرف وصالة' },
    { id: 2, title: 'فيلا راقية', type: 'فيلا', details: '5 غرف وحديقة' },
  ]);
  const [unitForm, setUnitForm] = useState({ title: '', type: '', details: '' });
  // مطورين محفوظين
  const [devs, setDevs] = usePersistedState<any[]>('admin-devs', [
    { id: 1, name: 'سوديك', country: 'مصر' },
    { id: 2, name: 'بالم هيلز', country: 'مصر' },
  ]);
  const [devForm, setDevForm] = useState({ name: '', country: '' });
  // مستخدمين محفوظين
  const [users, setUsers] = usePersistedState<any[]>('admin-users', [
    { id: 1, name: 'أحمد', role: 'مدير' },
    { id: 2, name: 'منى', role: 'موظف' },
  ]);
  const [userForm, setUserForm] = useState({ name: '', role: 'موظف' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // جلب المطورين من Firestore (مؤقتًا بيانات محلية)
  useEffect(() => {
    try {
      setDevs(developers);
    } catch (err: any) {
      setError('setDevs error: ' + (err?.message || String(err)));
    }
  }, []);

  // إضافة وحدة
  const handleAddUnit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      setUnits(u => [...u, { ...unitForm, id: Date.now() }]);
      setUnitForm({ title: '', type: '', details: '' });
      setSuccess('تمت إضافة الوحدة بنجاح!');
      setError(null);
    } catch (err: any) {
      setError('خطأ في إضافة الوحدة: ' + (err?.message || String(err)));
      setSuccess(null);
    }
    setLoading(false);
  };
  // حذف وحدة
  const handleDeleteUnit = (id: number) => {
    setUnits(u => u.filter(x => x.id !== id));
  };
  // إضافة مطور
  const handleAddDev = (e: any) => {
    e.preventDefault();
    setDevs(d => [...d, { ...devForm, id: Date.now() }]);
    setDevForm({ name: '', country: '' });
    setSuccess('تمت إضافة المطور بنجاح!');
    setError(null);
  };
  // إضافة مستخدم
  const handleAddUser = (e: any) => {
    e.preventDefault();
    setUsers(u => [...u, { ...userForm, id: Date.now() }]);
    setUserForm({ name: '', role: 'موظف' });
    setSuccess('تمت إضافة المستخدم بنجاح!');
    setError(null);
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
          }}>{t.label}</button>
        ))}
      </div>
      {/* محتوى لوحة التحكم */}
      <div style={{background:'#fff',borderRadius:16,padding:24,boxShadow:'0 2px 16px #e0e0e0',flex:1,minWidth:320}}>
        <div style={{fontSize:22,color:'#00bcd4',fontWeight:'bold',marginBottom:16}}>{tab}</div>
        {success && <div style={{color:'#388e3c',marginBottom:12}}>{success}</div>}
        {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
        {/* الوحدات */}
        {tab==='الوحدات' && (
          <div>
            <form onSubmit={handleAddUnit} style={{marginBottom:24}}>
              <input value={unitForm.title} onChange={e=>setUnitForm(f=>({...f,title:e.target.value}))} placeholder="اسم الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.type} onChange={e=>setUnitForm(f=>({...f,type:e.target.value}))} placeholder="نوع الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.details} onChange={e=>setUnitForm(f=>({...f,details:e.target.value}))} placeholder="تفاصيل" style={{margin:4,padding:8,borderRadius:8}} required />
              <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}} disabled={loading}>إضافة وحدة</button>
            </form>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {units.map((u,i)=>(
                <div key={u.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:220,maxWidth:260,position:'relative'}}>
                  <b>{u.title}</b>
                  <div>النوع: {u.type}</div>
                  <div>تفاصيل: {u.details}</div>
                  <button onClick={()=>handleDeleteUnit(u.id)} style={{position:'absolute',top:8,left:8,background:'#e53935',color:'#fff',border:'none',borderRadius:6,padding:'2px 10px',fontWeight:'bold',cursor:'pointer'}}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* المطورين */}
        {tab==='المطورين' && (
          <div>
            <form onSubmit={handleAddDev} style={{marginBottom:24}}>
              <input value={devForm.name} onChange={e=>setDevForm(f=>({...f,name:e.target.value}))} placeholder="اسم المطور" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={devForm.country} onChange={e=>setDevForm(f=>({...f,country:e.target.value}))} placeholder="الدولة" style={{margin:4,padding:8,borderRadius:8}} required />
              <button type="submit" style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',marginTop:8,cursor:'pointer'}}>إضافة المطور</button>
            </form>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {devs.map((d:any) => (
                <div key={d.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:180,maxWidth:220}}>
                  <b>{d.name}</b>
                  <div>{d.country}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* المستخدمون */}
        {tab==='المستخدمون' && (
          <div>
            <form onSubmit={handleAddUser} style={{marginBottom:24}}>
              <input value={userForm.name} onChange={e=>setUserForm(f=>({...f,name:e.target.value}))} placeholder="اسم المستخدم" style={{margin:4,padding:8,borderRadius:8}} required />
              <select value={userForm.role} onChange={e=>setUserForm(f=>({...f,role:e.target.value}))} style={{margin:4,padding:8,borderRadius:8}} required>
                <option value="موظف">موظف</option>
                <option value="مدير">مدير</option>
                <option value="مطور">مطور</option>
              </select>
              <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}}>إضافة مستخدم</button>
            </form>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {users.map((u:any) => (
                <div key={u.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:180,maxWidth:220}}>
                  <b>{u.name}</b>
                  <div>{u.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* باقي الأقسام */}
        {tab!=='الوحدات' && tab!=='المطورين' && tab!=='المستخدمون' && <div style={{color:'#888',fontSize:18}}>سيتم تفعيل هذا القسم قريبًا...</div>}
      </div>
    </div>
  );
};

export default AdminPanel;
