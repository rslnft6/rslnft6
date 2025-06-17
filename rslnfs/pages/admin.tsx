import dynamic from 'next/dynamic';
const AdminPanel = dynamic(() => import('../components/AdminPanel'), { ssr: false });
export default function AdminPage() {
  return <div style={{padding:40,maxWidth:900,margin:'auto'}}><AdminPanel /></div>;
}
