'use client'
import { useState } from 'react';
import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/utils/firestore'
import { useRouter } from 'next/navigation';
import { Log } from '@/components/log';

export default function Signup() {
  Log();
  const user = useAuthState(auth)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter()

  const handleSignUP = async () => {
    try {
      if (cpassword === password) {
        const res = await createUserWithEmailAndPassword(email, password);
        console.log({ res });
        sessionStorage.setItem('user', 'true');
        setEmail('');
        setPassword('');
        setCPassword('');
        if (res) {
          router.push('/pos')
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
      <div className="bg-[#1a1938] p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
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
        <input
          type="password"
          placeholder="Conform password"
          value={cpassword}
          onChange={(e) => setCPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-[#252446] rounded outline-none text-white placeholder-gray-500"
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

