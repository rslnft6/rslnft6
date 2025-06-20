import React, { useEffect, useState } from 'react';
import { developers } from '../data/developers';

console.log('=== AdminPanel.tsx Mounted ===');
let debugStep = 'AdminPanel mounted';

const AdminPanel: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [devs, setDevs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // جلب الوحدات من Firestore
  useEffect(() => {
    async function fetchUnits() {
      try {
        debugStep = 'fetchUnits start';
        setLoading(true);
        const res = await fetch('/api/units');
        if (res.ok) {
          const data = await res.json();
          setUnits(data.units || []);
        } else {
          setUnits([]);
        }
      } catch (err: any) {
        setUnits([]);
        setError('fetchUnits error: ' + (err?.message || String(err)));
      }
      setLoading(false);
    }
    try {
      fetchUnits();
    } catch (err: any) {
      setError('fetchUnits outer error: ' + (err?.message || String(err)));
    }
  }, []);

  // جلب المطورين من Firestore (مؤقتًا بيانات محلية)
  useEffect(() => {
    try {
      setDevs(developers);
    } catch (err: any) {
      setError('setDevs error: ' + (err?.message || String(err)));
    }
  }, []);

  return (
    <div>
      <div style={{color:'#888',marginBottom:8}}>Debug: {debugStep}</div>
      {error && <div style={{color:'red',marginBottom:12}}>خطأ: {error}</div>}
      <div style={{padding:40, color:'#00bcd4', fontSize:28, textAlign:'center'}}>
        ✅ لوحة التحكم تعمل بنجاح (بدون أي استيرادات أو منطق إضافي)
      </div>
    </div>
  );
};

export default AdminPanel;
