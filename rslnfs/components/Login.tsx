import React, { useState } from 'react';
import { auth, googleProvider } from '../data/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const Login: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  const handleLogin = async () => {
    if (!auth || !googleProvider) {
      alert('لم يتم تفعيل المصادقة. يرجى ضبط بيانات Firebase في .env.local');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      alert('فشل تسجيل الدخول');
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  };

  if (!auth || !googleProvider) {
    return <div style={{color:'red',textAlign:'center',margin:'24px 0'}}>المصادقة غير مفعلة. يرجى ضبط بيانات Firebase في <b>.env.local</b></div>;
  }

  return (
    <div style={{textAlign:'center',margin:'24px 0'}}>
      {user ? (
        <>
          <p>مرحباً {user.displayName}</p>
          <button onClick={handleLogout}>تسجيل الخروج</button>
        </>
      ) : (
        <button onClick={handleLogin}>تسجيل الدخول باستخدام Google</button>
      )}
    </div>
  );
};

export default Login;
