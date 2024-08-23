'use client'

import { db, auth } from '@/utils/firestore'
import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Logout } from '@/components/logout'

export default function Order() {
    const [orders, setOrders] = useState<any[]>([]) // حالة لتخزين الطلبات
    const [loading, setLoading] = useState(true) // حالة التحميل
    const [error, setError] = useState<any>(null) // حالة الخطأ
    const [user] = useAuthState(auth) // الحصول على المستخدم الحالي
    useEffect(() => {
        if (!user) return;

        // الاستعلام للحصول على الطلبات الخاصة بالمستخدم الحالي
        const userOrdersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid))

        // استخدام onSnapshot للحصول على التحديثات الفورية
        const unsubscribe = onSnapshot(
            userOrdersQuery,
            (snapshot) => {
                const ordersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setOrders(ordersList) // تحديث حالة الطلبات
                setLoading(false) // إنهاء حالة التحميل
            },
            (err) => {
                console.error('Error fetching orders:', err)
                setError('Failed to load orders')
                setLoading(false)
            }
        )

        // تنظيف الاشتراك في onSnapshot عند إلغاء التركيب
        return () => unsubscribe()
    }, [user]) // يتم تشغيلها عند تغيير المستخدم

    if (loading) return <p className="text-center mt-10 text-lg">Loading orders...</p> // عرض رسالة التحميل
    if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p> // عرض رسالة الخطأ

    return (
        <div className="p-8  min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
            {orders.length === 0 ? (
                <p className="text-center text-lg">You have no orders.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div key={order.id} className="p-4 bg-[#1a1938] rounded-md shadow-md ">
                            <h2 className="text-xl font-semibold mb-2">Order ID: {order.id}</h2>
                            <p className="text-md mb-2">User ID: {order.userId}</p>
                            <ul className="mb-4">
                                {order.products.map((product: any, index: number) => (
                                    <li key={index} className="text-gray-300 mb-1">
                                        <span className="font-semibold">{product.name}</span> - Quantity: {product.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-md mb-4">Status: <span className={`font-semibold ${order.status === 'completed' ? 'text-green-500' : order.status === 'in-progress' ? 'text-yellow-500' : 'text-red-500'}`}>{order.status}</span></p>
                            <Logout link='shop/order'/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
