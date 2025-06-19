import { collection, addDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { auth } from '../data/firebase';

// إضافة موظف جديد
export async function addEmployee({ name, email, role }: { name: string, email: string, role: string }) {
  const db = getFirestore();
  return await addDoc(collection(db, 'users'), {
    name,
    email,
    role,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid || null
  });
}

// إضافة وحدة جديدة
export async function addUnit({ title, type, details }: { title: string, type: string, details: string }) {
  const db = getFirestore();
  return await addDoc(collection(db, 'units'), {
    title,
    type,
    details,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid || null
  });
}
