'use client'
import { useState } from 'react';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/utils/firestore'
import { useRouter } from 'next/navigation';
import { Log } from '@/components/log';

export default function Login() {
  Log();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()
  const user = useAuthState(auth)

  const handleLogIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      setEmail('');
      setPassword('');
      sessionStorage.setItem('user', 'true');
      if (res) {
        router.push('/pos')
      }
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="bg-[#1a1938] p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-[#252446] rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-[#252446] rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleLogIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Login
        </button>
      </div>
    </div>
  );
};

