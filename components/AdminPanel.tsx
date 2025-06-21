import React, { useEffect, useState } from 'react';
import { developers } from '../data/developers';
import { db } from '../data/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { defaultContacts, ContactLinks } from '../data/contacts';
import { doc as fsDoc, getDoc, setDoc } from 'firebase/firestore';

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
  const allowedTabs = ['الوحدات', 'المطورين', 'المستخدمون', 'الإعلانات', 'الإعدادات'];

  // وحدات Firestore
  const [units, setUnits] = useState<any[]>([]);
  const [unitForm, setUnitForm] = useState<{
    title: string;
    type: string;
    details: string;
    area: string;
    rooms: string;
    bathrooms: string;
    kitchens: string;
    hasGarden: boolean;
    hasPool: boolean;
    phone: string;
    whatsapp: string;
    lat: string;
    lng: string;
    images: File[];
    vrUrl: string;
    panoramaUrl: string;
    model3dUrl: string;
    developerId: string;
    compound: string;
    price: string;
    paymentType: string;
    finance: string;
  }>({
    title: '', type: '', details: '', area: '', rooms: '', bathrooms: '', kitchens: '', hasGarden: false, hasPool: false, phone: '', whatsapp: '', lat: '', lng: '', images: [], vrUrl: '', panoramaUrl: '', model3dUrl: '', developerId: '', compound: '', price: '', paymentType: '', finance: ''
  });
  // مطورين Firestore
  const [devs, setDevs] = useState<any[]>([]);
  const [devForm, setDevForm] = useState({ name: '', country: '' });
  // مستخدمين Firestore
  const [users, setUsers] = useState<any[]>([]);
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'موظف' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // بيانات التواصل
  const [contacts, setContacts] = useState<ContactLinks>(defaultContacts);
  const [contactsLoading, setContactsLoading] = useState(false);

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
  // جلب بيانات التواصل من Firestore
  useEffect(() => {
    const fetchContacts = async () => {
      setContactsLoading(true);
      try {
        const ref = fsDoc(db, 'settings', 'contacts');
        const snap = await getDoc(ref);
        if (snap.exists()) setContacts(snap.data() as ContactLinks);
      } catch {}
      setContactsLoading(false);
    };
    fetchContacts();
  }, []);

  // إضافة وحدة إلى Firestore
  const handleAddUnit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      // رفع الصور إلى Firebase Storage إذا تم اختيارها
      let imageUrls: string[] = [];
      if (unitForm.images && unitForm.images.length > 0) {
        const storageRef = (await import('firebase/storage')).ref;
        const { getStorage, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const storage = getStorage();
        for (const img of unitForm.images) {
          const imgRef = storageRef(storage, `units/${Date.now()}_${img.name}`);
          await uploadBytes(imgRef, img);
          const url = await getDownloadURL(imgRef);
          imageUrls.push(url);
        }
      }
      await addDoc(collection(db, 'units'), {
        ...unitForm,
        images: imageUrls,
        price: unitForm.price,
        paymentType: unitForm.paymentType,
        finance: unitForm.finance,
        developerId: unitForm.developerId,
        compound: unitForm.compound,
        area: unitForm.area,
        rooms: unitForm.rooms,
        bathrooms: unitForm.bathrooms,
        kitchens: unitForm.kitchens,
        hasGarden: unitForm.hasGarden,
        hasPool: unitForm.hasPool,
        phone: unitForm.phone,
        whatsapp: unitForm.whatsapp,
        lat: unitForm.lat,
        lng: unitForm.lng,
        vrUrl: unitForm.vrUrl,
        panoramaUrl: unitForm.panoramaUrl,
        model3dUrl: unitForm.model3dUrl
      });
      setUnitForm({
        title: '', type: '', details: '', area: '', rooms: '', bathrooms: '', kitchens: '', hasGarden: false, hasPool: false, phone: '', whatsapp: '', lat: '', lng: '', images: [], vrUrl: '', panoramaUrl: '', model3dUrl: '', developerId: '', compound: '', price: '', paymentType: '', finance: ''
      });
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
  // حفظ بيانات التواصل
  const handleSaveContacts = async (e: any) => {
    e.preventDefault();
    setContactsLoading(true);
    try {
      const ref = fsDoc(db, 'settings', 'contacts');
      await setDoc(ref, contacts);
      setSuccess('تم حفظ بيانات التواصل بنجاح!');
      setError(null);
    } catch (err: any) {
      setError('خطأ في حفظ بيانات التواصل: ' + (err?.message || String(err)));
      setSuccess(null);
    }
    setContactsLoading(false);
  };

  const allTabs = [...TABS, { key: 'التواصل', label: 'روابط التواصل' }];

  return (
    <div style={{display:'flex',gap:32,minHeight:600}}>
      {/* الشريط الجانبي */}
      <div style={{minWidth:180,background:'#f5f7fa',borderRadius:16,padding:'24px 0',boxShadow:'0 2px 12px #e0e0e0',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <div style={{fontWeight:'bold',fontSize:22,color:'#00bcd4',marginBottom:16}}>لوحة التحكم</div>
        {allTabs.filter(t => allowedTabs.includes(t.key) || t.key==='التواصل').map(t => (
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
            <form onSubmit={handleAddUnit} style={{marginBottom:24,display:'flex',flexWrap:'wrap',gap:8}}>
              <input value={unitForm.title} onChange={e=>setUnitForm(f=>({...f,title:e.target.value}))} placeholder="اسم الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.type} onChange={e=>setUnitForm(f=>({...f,type:e.target.value}))} placeholder="نوع الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.details} onChange={e=>setUnitForm(f=>({...f,details:e.target.value}))} placeholder="تفاصيل" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.area} onChange={e=>setUnitForm(f=>({...f,area:e.target.value}))} placeholder="المساحة (م²)" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.rooms} onChange={e=>setUnitForm(f=>({...f,rooms:e.target.value}))} placeholder="عدد الغرف" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.bathrooms} onChange={e=>setUnitForm(f=>({...f,bathrooms:e.target.value}))} placeholder="عدد الحمامات" style={{margin:4,padding:8,borderRadius:8}} required />
              <input value={unitForm.kitchens} onChange={e=>setUnitForm(f=>({...f,kitchens:e.target.value}))} placeholder="عدد المطابخ" style={{margin:4,padding:8,borderRadius:8}} />
              <label style={{margin:4}}><input type="checkbox" checked={unitForm.hasGarden} onChange={e=>setUnitForm(f=>({...f,hasGarden:e.target.checked}))}/> حديقة</label>
              <label style={{margin:4}}><input type="checkbox" checked={unitForm.hasPool} onChange={e=>setUnitForm(f=>({...f,hasPool:e.target.checked}))}/> حمام سباحة</label>
              <input value={unitForm.phone} onChange={e=>setUnitForm(f=>({...f,phone:e.target.value}))} placeholder="رقم الاتصال" style={{margin:4,padding:8,borderRadius:8}} />
              <input value={unitForm.whatsapp} onChange={e=>setUnitForm(f=>({...f,whatsapp:e.target.value}))} placeholder="رقم واتساب" style={{margin:4,padding:8,borderRadius:8}} />
              <input value={unitForm.lat} onChange={e=>setUnitForm(f=>({...f,lat:e.target.value}))} placeholder="خط العرض (lat)" style={{margin:4,padding:8,borderRadius:8}} />
              <input value={unitForm.lng} onChange={e=>setUnitForm(f=>({...f,lng:e.target.value}))} placeholder="خط الطول (lng)" style={{margin:4,padding:8,borderRadius:8}} />
              <input type="file" multiple accept="image/*" onChange={e=>setUnitForm(f=>({...f,images:Array.from(e.target.files||[])}))} style={{margin:4}} />
              <input value={unitForm.vrUrl} onChange={e=>setUnitForm(f=>({...f,vrUrl:e.target.value}))} placeholder="رابط VR أو 3D" style={{margin:4,padding:8,borderRadius:8}} />
              <input value={unitForm.panoramaUrl} onChange={e=>setUnitForm(f=>({...f,panoramaUrl:e.target.value}))} placeholder="رابط صورة بانوراما" style={{margin:4,padding:8,borderRadius:8}} />
              <input value={unitForm.model3dUrl} onChange={e=>setUnitForm(f=>({...f,model3dUrl:e.target.value}))} placeholder="رابط نموذج 3D" style={{margin:4,padding:8,borderRadius:8}} />
              <select value={unitForm.developerId} onChange={e=>setUnitForm(f=>({...f,developerId:e.target.value}))} style={{margin:4,padding:8,borderRadius:8}} required>
                <option value="">اختر المطور</option>
                {devs.map((d:any)=>(<option key={d.id} value={d.id}>{d.name}</option>))}
              </select>
              <input value={unitForm.compound} onChange={e=>setUnitForm(f=>({...f,compound:e.target.value}))} placeholder="اسم الكمبوند (اختياري)" style={{margin:4,padding:8,borderRadius:8}} />
              <input value={unitForm.price} onChange={e=>setUnitForm(f=>({...f,price:e.target.value}))} placeholder="السعر بالجنيه أو العملة" style={{margin:4,padding:8,borderRadius:8}} required />
              <select value={unitForm.paymentType} onChange={e=>setUnitForm(f=>({...f,paymentType:e.target.value}))} style={{margin:4,padding:8,borderRadius:8}} required>
                <option value="">نوع الدفع</option>
                <option value="كاش">كاش</option>
                <option value="تقسيط">تقسيط</option>
              </select>
              <select value={unitForm.finance} onChange={e=>setUnitForm(f=>({...f,finance:e.target.value}))} style={{margin:4,padding:8,borderRadius:8}} required>
                <option value="">تمويل عقاري؟</option>
                <option value="تمويل عقاري">تمويل عقاري</option>
                <option value="بدون تمويل">بدون تمويل</option>
              </select>
              <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}} disabled={loading}>إضافة وحدة</button>
            </form>
            {/* عرض الوحدات */}
            <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
              {units.map((u,i)=>(
                <div key={u.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:220,maxWidth:260,position:'relative'}}>
                  <b>{u.title}</b>
                  <div>النوع: {u.type}</div>
                  <div>المساحة: {u.area} م²</div>
                  <div>الغرف: {u.rooms}</div>
                  <div>الحمامات: {u.bathrooms}</div>
                  <div>المطابخ: {u.kitchens}</div>
                  <div>حديقة: {u.hasGarden?'نعم':'لا'} | حمام سباحة: {u.hasPool?'نعم':'لا'}</div>
                  <div>اتصال: {u.phone} | واتساب: {u.whatsapp}</div>
                  <div>الموقع: {u.lat && u.lng ? `${u.lat}, ${u.lng}` : '---'}</div>
                  <div>المطور: {devs.find(d=>d.id===u.developerId)?.name||'---'}</div>
                  <div>الكمبوند: {u.compound||'---'}</div>
                  <div>السعر: {u.price||'---'}</div>
                  <div>الدفع: {u.paymentType||'---'} | التمويل: {u.finance||'---'}</div>
                  {u.images && u.images.length>0 && <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{u.images.map((img:string,idx:number)=>(<img key={idx} src={img} alt="img" style={{width:48,height:48,borderRadius:6,objectFit:'cover'}}/>))}</div>}
                  {u.vrUrl && <div><a href={u.vrUrl} target="_blank" rel="noopener noreferrer">VR/3D</a></div>}
                  {u.panoramaUrl && <div><a href={u.panoramaUrl} target="_blank" rel="noopener noreferrer">بانوراما</a></div>}
                  {u.model3dUrl && <div><a href={u.model3dUrl} target="_blank" rel="noopener noreferrer">نموذج 3D</a></div>}
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
        {/* روابط التواصل */}
        {tab==='التواصل' && (
          <form onSubmit={handleSaveContacts} style={{maxWidth:400,margin:'0 auto',display:'flex',flexDirection:'column',gap:12}}>
            <h3 style={{color:'#00bcd4',marginBottom:8}}>روابط وأرقام التواصل</h3>
            <input value={contacts.whatsapp} onChange={e=>setContacts(f=>({...f,whatsapp:e.target.value}))} placeholder="رقم واتساب (دولي)" style={{padding:8,borderRadius:8}} required />
            <input value={contacts.phone} onChange={e=>setContacts(f=>({...f,phone:e.target.value}))} placeholder="رقم اتصال" style={{padding:8,borderRadius:8}} required />
            <input value={contacts.facebook} onChange={e=>setContacts(f=>({...f,facebook:e.target.value}))} placeholder="رابط فيسبوك" style={{padding:8,borderRadius:8}} />
            <input value={contacts.snapchat} onChange={e=>setContacts(f=>({...f,snapchat:e.target.value}))} placeholder="رابط سناب شات" style={{padding:8,borderRadius:8}} />
            <input value={contacts.twitter} onChange={e=>setContacts(f=>({...f,twitter:e.target.value}))} placeholder="رابط تويتر" style={{padding:8,borderRadius:8}} />
            <input value={contacts.instagram} onChange={e=>setContacts(f=>({...f,instagram:e.target.value}))} placeholder="رابط انستجرام" style={{padding:8,borderRadius:8}} />
            <input value={contacts.telegram} onChange={e=>setContacts(f=>({...f,telegram:e.target.value}))} placeholder="رابط تيليجرام" style={{padding:8,borderRadius:8}} />
            <input value={contacts.discord} onChange={e=>setContacts(f=>({...f,discord:e.target.value}))} placeholder="رابط ديسكورد" style={{padding:8,borderRadius:8}} />
            <input value={contacts.gmail} onChange={e=>setContacts(f=>({...f,gmail:e.target.value}))} placeholder="بريد إلكتروني (Gmail)" style={{padding:8,borderRadius:8}} />
            <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'10px 0',fontWeight:'bold',fontSize:17,marginTop:8}} disabled={contactsLoading}>حفظ</button>
          </form>
        )}
        {/* باقي الأقسام */}
        {tab!=='الوحدات' && tab!=='المطورين' && tab!=='المستخدمون' && (!allowedTabs.includes(tab)) && <div style={{color:'#888',fontSize:18}}>ليس لديك صلاحية لهذا القسم.</div>}
        {tab!=='الوحدات' && tab!=='المطورين' && tab!=='المستخدمون' && allowedTabs.includes(tab) && <div style={{color:'#888',fontSize:18}}>سيتم تفعيل هذا القسم قريبًا...</div>}
      </div>
    </div>
  );
};

export default AdminPanel;
