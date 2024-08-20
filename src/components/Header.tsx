'use client'
import { auth } from '@/utils/firestore'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Header() {
    const [user] = useAuthState(auth)
    const [userSession, setUserSession] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // التأكد من أن هذا الكود يعمل فقط على العميل
        if (typeof window !== 'undefined') {
            // تحديث userSession بناءً على التغييرات في user
            setUserSession(sessionStorage.getItem('user'))
        }
    }, [user])  // تحديث عند تغيير user

    useEffect(() => {
        // التأكد من أن هذا الكود يعمل فقط على العميل
        if (typeof window !== 'undefined') {
            // تحديث sessionStorage عند تغيير user
            if (user) {
                sessionStorage.setItem('user', user.uid)
            } else {
                sessionStorage.removeItem('user')
            }
            setUserSession(sessionStorage.getItem('user'))
        }
    }, [user])  // تحديث عند تغيير user

    const logOut = async () => {
        try {
            await signOut(auth)
            console.log('Logged out!')
            router.push('/login')
        } catch (error) {
            console.error('Error during sign out', error)
        }
    }

    return (
        <div className="flex flex-row w-full justify-between items-center px-5 h-10 gap-10 bg-[#1a1938] text-white py-6">
            <div className='flex flex-row  justify-center items-center gap-10'>
                <Link href='/login' className={`${user && userSession ? 'hidden' : ''}`}>Login</Link>
                <Link href='/signup' className={`${user && userSession ? 'hidden' : ''}`}>Signup</Link>
                <Link href='/account' className={`${user && userSession ? '' : 'hidden'}`}>Account</Link>
                <Link href='/pos' className={`${user && userSession ? '' : 'hidden'}`}>POS</Link>
                <Link href='/kds' className={`${user && userSession ? '' : 'hidden'}`}>KDS</Link>
            </div>
            <div>
                <button onClick={logOut} className={`bg-red-300 px-2 py-1 rounded-sm ${user && userSession ? '' : 'hidden'}`}>LogOut</button>
            </div>
        </div>
    )
}
