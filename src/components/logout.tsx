"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { auth } from '@/utils/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

export function Logout() {
  const [user] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userSession = sessionStorage.getItem('user')
      if (!user && !userSession) {
        router.replace('/login')
      }
    }
  }, [user, router])

  return null;
}
