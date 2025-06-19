import { useState } from 'react';
import dynamic from 'next/dynamic';
const AdminPanel = dynamic(() => import('../components/AdminPanel'), { ssr: false });

const ADMIN_CODES = ['123456', '654321', '999999']; // أكواد الدخول المسموح بها (يمكنك تعديلها)

export default function AdminPage() {
  const [code, setCode] = useState('');
  const [logged, setLogged] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e:any) => {
    e.preventDefault();
    if (ADMIN_CODES.includes(code.trim())) {
      setLogged(true);
      setError('');
    } else {
      setError('الكود غير صحيح! اطلب الكود من الإدارة.');
    }
  };

  if (!logged) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f7fa'}}>
        <form onSubmit={handleLogin} style={{background:'#fff',padding:32,borderRadius:16,boxShadow:'0 2px 16px #e0e0e0',minWidth:320}}>
          <h2 style={{color:'#00bcd4',marginBottom:16}}>تسجيل دخول لوحة التحكم</h2>
          <input type="password" placeholder="ادخل الكود السري" value={code} onChange={e=>setCode(e.target.value)} style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #b6c6e6',marginBottom:12,fontSize:18}} />
          <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:'bold',fontSize:18,width:'100%'}}>دخول</button>
          {error && <div style={{color:'#e53935',marginTop:12,fontWeight:'bold'}}>{error}</div>}
        </form>
      </div>
    );
  }

  return <div style={{padding:40,maxWidth:1100,margin:'auto'}}><AdminPanel /></div>;
}
