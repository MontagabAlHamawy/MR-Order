'use client'
import { Logout } from '@/components/logout'
import { auth } from '@/utils/firestore'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Kds() {
  Logout()
  return (
    <div>KDS</div>
  )
}
