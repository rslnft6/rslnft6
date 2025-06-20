import React, { useEffect, useState } from 'react';
import { developers } from '../data/developers';

console.log('=== AdminPanel.tsx Mounted ===');
let debugStep = 'AdminPanel mounted';

const AdminPanel: React.FC = () => {
  // وحدات وهمية محلية
  const [units, setUnits] = useState<any[]>([
    { id: 1, title: 'شقة فاخرة', type: 'شقة', details: '3 غرف وصالة' },
    { id: 2, title: 'فيلا راقية', type: 'فيلا', details: '5 غرف وحديقة' },
  ]);
  const [unitForm, setUnitForm] = useState({ title: '', type: '', details: '' });
  const [devs, setDevs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // جلب المطورين من Firestore (مؤقتًا بيانات محلية)
  useEffect(() => {
    try {
      setDevs(developers);
    } catch (err: any) {
      setError('setDevs error: ' + (err?.message || String(err)));
    }
  }, []);

  // إضافة وحدة جديدة (محلي فقط)
  const handleAddUnit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      setUnits(u => [...u, { ...unitForm, id: Date.now() }]);
      setUnitForm({ title: '', type: '', details: '' });
      setError(null);
    } catch (err: any) {
      setError('خطأ في إضافة الوحدة: ' + (err?.message || String(err)));
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{color:'#888',marginBottom:8}}>Debug: {debugStep}</div>
      {error && <div style={{color:'red',marginBottom:12}}>خطأ: {error}</div>}
      <h2 style={{color:'#00bcd4'}}>لوحة تحكم الأدمن</h2>
      <form onSubmit={handleAddUnit} style={{marginBottom:24}}>
        <input value={unitForm.title} onChange={e=>setUnitForm(f=>({...f,title:e.target.value}))} placeholder="اسم الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
        <input value={unitForm.type} onChange={e=>setUnitForm(f=>({...f,type:e.target.value}))} placeholder="نوع الوحدة" style={{margin:4,padding:8,borderRadius:8}} required />
        <input value={unitForm.details} onChange={e=>setUnitForm(f=>({...f,details:e.target.value}))} placeholder="تفاصيل" style={{margin:4,padding:8,borderRadius:8}} required />
        <button type="submit" style={{background:'#00bcd4',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:'bold',margin:4}} disabled={loading}>إضافة وحدة</button>
      </form>
      <h4>الوحدات الحالية:</h4>
      <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
        {units.map((u,i)=>(
          <div key={u.id} style={{border:'1px solid #eee',borderRadius:12,padding:12,minWidth:220,maxWidth:260}}>
            <b>{u.title}</b>
            <div>النوع: {u.type}</div>
            <div>تفاصيل: {u.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
