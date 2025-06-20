import React, { useEffect, useState } from 'react';
import { developers } from '../data/developers';
import { db } from '../data/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

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
  // جلب المستخدم الحالي من localStorage
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('admin-current-user');
      if (u) setCurrentUser(JSON.parse(u));
    }
  }, []);

  // صلاحيات الأدوار
  const rolePermissions: any = {
    'مدير': ['الوحدات', 'المطورين', 'المستخدمون', 'الإعلانات', 'الإعدادات'],
    'موظف': ['الوحدات', 'المطورين'],
    'مطور': ['الوحدات'],
  };
  const allowedTabs = currentUser ? (rolePermissions[currentUser.role] || []) : [];

  // وحدات Firestore
  const [units, setUnits] = useState<any[]>([]);
  const [unitForm, setUnitForm] = useState({ title: '', type: '', details: '' });
  // مطورين Firestore
  const [devs, setDevs] = useState<any[]>([]);
  const [devForm, setDevForm] = useState({ name: '', country: '' });
  // مستخدمين Firestore
  const [users, setUsers] = useState<any[]>([]);
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'موظف' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const auth = getAuth();

  // جلب المطورين من Firestore بشكل لحظي
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'developers'), (snapshot) => {
      setDevs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);
  // جلب الوحدات من Firestore بشكل لحظي
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'units'), (snapshot) => {
      setUnits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);
  // جلب المستخدمين من Firestore بشكل لحظي
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // إضافة وحدة إلى Firestore
  const handleAddUnit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'units'), unitForm);
      setUnitForm({ title: '', type: '', details: '' });
      setSuccess('تمت إضافة الوحدة بنجاح!');
      setError(null);
    } catch (err: any) {
      setError('خطأ في إضافة الوحدة: ' + (err?.message || String(err)));
      setSuccess(null);
    }
    setLoading(false);
  };
  // حذف وحدة من Firestore
  const handleDeleteUnit = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'units', id));
      setSuccess('تم حذف الوحدة بنجاح!');
      setError(null);
    } catch (err: any) {
      setError('خطأ في الحذف: ' + (err?.message || String(err)));
      setSuccess(null);
    }
    setLoading(false);
  };
  // إضافة مطور إلى Firestore
  const handleAddDev = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'developers'), devForm);
      setDevForm({ name: '', country: '' });
      setSuccess('تمت إضافة المطور بنجاح!');
      setError(null);
    } catch (err: any) {
      setError('خطأ في إضافة المطور: ' + (err?.message || String(err)));
      setSuccess(null);
    }
    setLoading(false);
  };
  // حذف مطور من Firestore
  const handleDeleteDev = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'developers', id));
      setSuccess('تم حذف المطور بنجاح!');
      setError(null);
    } catch (err: any) {
      setError('خطأ في الحذف: ' + (err?.message || String(err)));
      setSuccess(null);
    }
    setLoading(false);
  };
  // إضافة مستخدم إلى Firestore + Firebase Auth
  const handleAddUser = async (e: any) => {
    e.preventDefault();
    if (!userForm.name || !userForm.username || !userForm.password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (users.some(u => u.username === userForm.username)) {
      setError('اسم المستخدم مستخدم بالفعل');
      return;
    }
    setLoading(true);
    try {
      // إنشاء مستخدم في Firebase Auth (بريد إلكتروني وهمي)
      const email = userForm.username + '@app.local';
      const cred = await createUserWithEmailAndPassword(auth, email, userForm.password);
      await updateProfile(cred.user, { displayName: userForm.name });
      // إضافة المستخدم إلى Firestore
      await addDoc(collection(db, 'users'), {
        name: userForm.name,
        username: userForm.username,
        role: userForm.role,
        uid: cred.user.uid
      });
      setUserForm({ name: '', username: '', password: '', role: 'موظف' });
      setSuccess('تمت إضافة المستخدم وتفعيله بنجاح!');
      setError(null);
    } catch (err: any) {
      setError('خطأ في إضافة المستخدم: ' + (err?.message || String(err)));
      setSuccess(null);
    }
    setLoading(false);
  };
  // حذف مستخدم من Firestore
  const handleDeleteUser = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'users', id));
      setSuccess('تم حذف المستخدم بنجاح!');
      setError(null);
    } catch (err: any) {
      setError('خطأ في الحذف: ' + (err?.message || String(err)));
      setSuccess(null);
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex',gap:32,minHeight:600}}>
      {/* الشريط الجانبي */}
      <div style={{minWidth:180,background:'#f5f7fa',borderRadius:16,padding:'24px 0',boxShadow:'0 2px 12px #e0e0e0',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <div style={{fontWeight:'bold',fontSize:22,color:'#00bcd4',marginBottom:16}}>لوحة التحكم</div>
        {TABS.filter(t => allowedTabs.includes(t.key)).map(t => (
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
        {currentUser && (
          <div style={{marginTop:24,color:'#888',fontSize:15}}>
            مرحباً، {currentUser.name} <br/>({currentUser.role})
            <button onClick={()=>{localStorage.removeItem('admin-current-user');window.location.reload();}} style={{marginTop:8,background:'#e53935',color:'#fff',border:'none',borderRadius:6,padding:'4px 14px',fontWeight:'bold',cursor:'pointer'}}>تسجيل خروج</button>
          </div>
        )}
      </div>
      {/* محتوى لوحة التحكم */}
      <div style={{background:'#fff',borderRadius:16,padding:24,boxShadow:'0 2px 16px #e0e0e0',flex:1,minWidth:320}}>
        <div style={{fontSize:22,color:'#00bcd4',fontWeight:'bold',marginBottom:16}}>{tab}</div>
        {success && <div style={{color:'#388e3c',marginBottom:12}}>{success}</div>}
        {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
        {/* الوحدات */}
        {tab==='الوحدات' && allowedTabs.includes('الوحدات') && (
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
        {tab==='المطورين' && allowedTabs.includes('المطورين') && (
          <div>
            <form onSubmit={handleAddDev} style={{marginBottom:24}}>
              <input value={devForm.name} onChange={e=>setDevForm(f=>({...f,name:e.target.value}))} placeholder="اسم المطور" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={devForm.country} onChange={e=>setDevForm(f=>({...f,country:e.target.value}))} placeholder="الدولة" style={{margin:4,padding:8,borderRadius:8}} required />
              <button type="submit" style={{background:'#2196f3',color:'#fff',border:'none',borderRadius:8,padding:'8px 24px',marginTop:8,cursor:'pointer'}} disabled={loading}>إضافة المطور</button>
            </form>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {devs.map((d:any) => (
                <div key={d.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:180,maxWidth:220,position:'relative'}}>
                  <b>{d.name}</b>
                  <div>{d.country}</div>
                  <button onClick={()=>handleDeleteDev(d.id)} style={{position:'absolute',top:8,left:8,background:'#e53935',color:'#fff',border:'none',borderRadius:6,padding:'2px 10px',fontWeight:'bold',cursor:'pointer'}}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* المستخدمون */}
        {tab==='المستخدمون' && allowedTabs.includes('المستخدمون') && (
          <div>
            <form onSubmit={handleAddUser} style={{marginBottom:24}}>
              <input value={userForm.name} onChange={e=>setUserForm(f=>({...f,name:e.target.value}))} placeholder="اسم المستخدم" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={userForm.username} onChange={e=>setUserForm(f=>({...f,username:e.target.value}))} placeholder="اسم الدخول" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={userForm.password} onChange={e=>setUserForm(f=>({...f,password:e.target.value}))} placeholder="كلمة السر" type="password" style={{margin:4,padding:8,borderRadius:8}} required />
              <select value={userForm.role} onChange={e=>setUserForm(f=>({...f,role:e.target.value}))} style={{margin:4,padding:8,borderRadius:8}} required>
                <option value="موظف">موظف</option>
                <option value="مدير">مدير</option>
                <option value="مطور">مطور</option>
              </select>
              <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}}>إضافة مستخدم</button>
            </form>
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {users.map((u:any) => (
                <div key={u.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:180,maxWidth:220,position:'relative'}}>
                  <b>{u.name}</b>
                  <div>اسم الدخول: {u.username}</div>
                  <div>الدور: {u.role}</div>
                  <button onClick={()=>handleDeleteUser(u.id)} style={{position:'absolute',top:8,left:8,background:'#e53935',color:'#fff',border:'none',borderRadius:6,padding:'2px 10px',fontWeight:'bold',cursor:'pointer'}}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* باقي الأقسام */}
        {tab!=='الوحدات' && tab!=='المطورين' && tab!=='المستخدمون' && (!allowedTabs.includes(tab)) && <div style={{color:'#888',fontSize:18}}>ليس لديك صلاحية لهذا القسم.</div>}
        {tab!=='الوحدات' && tab!=='المطورين' && tab!=='المستخدمون' && allowedTabs.includes(tab) && <div style={{color:'#888',fontSize:18}}>سيتم تفعيل هذا القسم قريبًا...</div>}
      </div>
    </div>
  );
};

export default AdminPanel;
