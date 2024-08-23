'use client'
import { useEffect, useState } from 'react';
import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/utils/firestore'
import { useRouter } from 'next/navigation';
import { Logout } from '@/components/logout';
import toast from 'react-hot-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter()
  const [user, loading] = useAuthState(auth); // استرجاع حالة المستخدم والحالة التحميل

  useEffect(() => {
    if (!loading) { // تأكد من انتهاء تحميل البيانات
      if (user) {
        router.push(`/shop`); // التوجيه إذا كان المستخدم مسجلاً
      } else {
        router.push('/signup'); // التوجيه إذا لم يكن المستخدم مسجلاً
      }
    }
  }, [user, loading, router]);

  const handleSignUP = async () => {
    try {
      if (cpassword === password) {
        const res = await createUserWithEmailAndPassword(email, password);
        sessionStorage.setItem('user', 'true');
        setEmail('');
        setPassword('');
        setCPassword('');
        if (res) {
          toast.success('Signup successful')
          router.push('/shop')
        }
      } else {
        console.error('Config Password');
        setPassword('');
        setCPassword('');
      }
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="bg-section p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-body rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-body rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Conform password"
          value={cpassword}
          onChange={(e) => setCPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-body rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignUP}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

