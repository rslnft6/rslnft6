import React, { useEffect, useState } from 'react';

const StatsBox: React.FC = () => {
  // بيانات إحصائية تجريبية
  const [stats, setStats] = useState({
    users: 1200,
    properties: 350,
    devs: 42,
    visits: 18000,
    views: 54000
  });
  useEffect(() => {
    // في التطبيق الحقيقي: اجلب من قاعدة البيانات أو API
  }, []);
  return (
    <div style={{background:'#fff',borderRadius:16,padding:24,boxShadow:'0 2px 16px #e0e0e0',margin:'32px 0',display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap'}}>
      <div><b style={{color:'#00bcd4',fontSize:28}}>{stats.users}</b><div style={{color:'#888'}}>مستخدم</div></div>
      <div><b style={{color:'#ff9800',fontSize:28}}>{stats.properties}</b><div style={{color:'#888'}}>وحدة عقارية</div></div>
      <div><b style={{color:'#673ab7',fontSize:28}}>{stats.devs}</b><div style={{color:'#888'}}>مطور</div></div>
      <div><b style={{color:'#2196f3',fontSize:28}}>{stats.visits}</b><div style={{color:'#888'}}>زيارة</div></div>
      <div><b style={{color:'#00e676',fontSize:28}}>{stats.views}</b><div style={{color:'#888'}}>مشاهدة</div></div>
    </div>
  );
};

export default StatsBox;
