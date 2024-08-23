"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { auth } from '@/utils/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

export function Logout(link: any) {
  const [user] = useAuthState(auth)
  const router = useRouter()
  if (user) {
    router.push(`/${link}`);
  } else {
    router.push('/login');
  }

  return null;
}
