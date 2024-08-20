"use client"
import { Logout } from '@/components/logout'
import { auth } from '@/utils/firestore'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Account() {
  const [user] = useAuthState(auth)
  Logout()
  return (
    <div>
      <h1>{user?.email}</h1>
    </div>
  )
}
