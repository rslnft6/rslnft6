import { useState } from 'react';
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('../components/AdminPanel'), { ssr: false });

const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_MASTER_PASSWORD || '112233';

export default function AdminPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [logged, setLogged] = useState(false);

  if (!logged) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f7fa'}}>
        <form onSubmit={e=>{
          e.preventDefault();
          if(user === ADMIN_USER && pass === ADMIN_PASS) {
            setLogged(true);
            setError('');
          } else {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة');
          }
        }} style={{background:'#fff',padding:32,borderRadius:16,boxShadow:'0 2px 16px #e0e0e0',minWidth:320}}>
          <h2 style={{color:'#00bcd4',marginBottom:16}}>دخول لوحة التحكم</h2>
          <input type="text" placeholder="اسم المستخدم" value={user} onChange={e=>setUser(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #b6c6e6',marginBottom:12,fontSize:18}} required />
          <input type="password" placeholder="كلمة المرور" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #b6c6e6',marginBottom:12,fontSize:18}} required />
          <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:'bold',fontSize:18,width:'100%'}}>دخول</button>
          {error && <div style={{color:'#e53935',marginTop:12,fontWeight:'bold'}}>{error}</div>}
        </form>
      </div>
    );
  }

  // بعد تسجيل الدخول، أظهر لوحة التحكم الفعلية
  return <div style={{padding:40,maxWidth:1100,margin:'auto'}}><AdminPanel /></div>;
}
