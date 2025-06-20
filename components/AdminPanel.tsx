import { useEffect } from 'react';

const AdminPanel: React.FC = () => {
  useEffect(() => {
    console.log('AdminPanel loaded');
  }, []);
  return <div style={{color:'#00bcd4',fontSize:32,textAlign:'center',padding:80}}>لوحة التحكم تعمل بنجاح! 🚀</div>;
};

export default AdminPanel;
