import { useState } from 'react';
import dynamic from 'next/dynamic';
import LoginForm from '../components/LoginForm';

const AdminPanel = dynamic(() => import('../components/AdminPanel'), { ssr: false });

export default function AdminPage() {
  const [logged, setLogged] = useState(false);

  if (!logged) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f7fa'}}>
        <LoginForm onSuccess={()=>setLogged(true)} />
      </div>
    );
  }

  return <div style={{padding:40,maxWidth:1100,margin:'auto'}}><AdminPanel /></div>;
}
