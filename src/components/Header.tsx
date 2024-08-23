'use client'
import { auth } from '@/utils/firestore'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FaShoppingCart } from 'react-icons/fa'

export default function Header() {
    const [user] = useAuthState(auth) // الحصول على حالة المستخدم
    const router = useRouter()

    const logOut = async () => {
        try {
            await signOut(auth)
            router.push('/login') // توجيه المستخدم إلى صفحة تسجيل الدخول بعد تسجيل الخروج
        } catch (error) {
            console.error('Error during sign out', error)
        }
    }

    return (
        <header className="flex flex-row w-full justify-between items-center px-5 h-16 bg-section text-white py-4">
            <div className="flex flex-row justify-center items-center gap-10">
                {!user ? (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Signup</Link>
                    </>
                ) : (
                    <>
                        <Link href="/shop">Shop</Link>
                        <Link href="/shop/order">Order</Link>
                        <Link href="/kitchen">Kitchen</Link>
                    </>
                )}
            </div>
            {user && (
                <button
                    onClick={logOut}
                    className="bg-red-500 px-4 py-2 rounded-md text-white"
                >
                    Log Out
                </button>
            )}
        </header>
    )
}
