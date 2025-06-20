import { db } from '../data/firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

async function createDefaultAdmin() {
  const auth = getAuth();
  const email = 'admin@app.local';
  const password = '112233';
  const name = 'مدير النظام';
  const username = 'admin';
  const role = 'مدير';

  try {
    // إنشاء المستخدم في Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // إضافة بيانات المستخدم في Firestore
    await addDoc(collection(db, 'users'), {
      name,
      username,
      role,
      uid: cred.user.uid
    });
    console.log('تم إنشاء مدير افتراضي بنجاح');
  } catch (err: any) {
    console.error('خطأ في إنشاء المدير الافتراضي:', err.message || err);
  }
}

createDefaultAdmin();
