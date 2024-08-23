'use client'
import { useState } from 'react';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/utils/firestore'
import { useRouter } from 'next/navigation';
import { Logout } from '@/components/logout';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');// الايميل
  const [password, setPassword] = useState('');// كلمة المرور
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()


  const handleLogIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);

      setEmail('');
      setPassword('');
      sessionStorage.setItem('user', 'true');
      if (res) {
        toast.success('Logout successful')
        router.push('/shop')
      }
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className=" bg-section p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Login</h1>
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
        <button
          onClick={handleLogIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Login
        </button>
      </div>
      <Logout link='shop' />
    </div>
  );
};

