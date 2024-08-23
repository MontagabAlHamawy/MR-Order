'use client'

import { db } from '@/utils/firestore'
import React, { useEffect, useState } from 'react'
import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { Logout } from '@/components/logout'

export default function Kitchen() {
    const [orders, setOrders] = useState<any[]>([]) //  لتخزين الطلبات
    const [loading, setLoading] = useState(true) //  التحميل
    const [error, setError] = useState<any>(null) //  الخطأ

    useEffect(() => {
        const ordersCollection = collection(db, 'orders') // مجموعة الطلبات

        //  التحديثات الفوري
        const unsubscribe = onSnapshot(ordersCollection,
            (snapshot) => {
                const ordersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setOrders(ordersList)
                setLoading(false)
            },
            (err) => {
                console.error('Error fetching orders:', err)
                setError('Failed to load orders')
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [])

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const orderDoc = doc(db, 'orders', orderId)
            await updateDoc(orderDoc, {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        }
    };

    if (loading) return <p className="text-center mt-10 text-lg">Loading orders...</p>
    if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p>

    return (
        <div className="p-8  min-h-screen">
            <h1 className="text-xl xl:text-2xl font-bold mb-8 text-center">Kitchen Display System (KDS)</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {orders.map((order: any) => (
                    <div key={order.id} className="p-4 bg-[#1a1938] 0 rounded-md shadow-md ">
                        <h2 className="text-xl font-semibold mb-2">Order ID: {order.id}</h2>
                        <p className="text-md mb-2">User ID: {order.userId}</p>
                        <p className="text-md mb-2">User Email: {order.userEmail}</p>
                        <ul className="my-4">
                            {order.products.map((product: any, index: number) => (
                                <li key={index} className="text-gray-300 mb-1">
                                    <span className="font-semibold">{product.name}</span> - Quantity: {product.quantity}
                                </li>
                            ))}
                        </ul>
                        <p className="text-md mb-4">Status: <span className={`font-semibold ${order.status === 'completed' ? 'text-green-500' : order.status === 'in-progress' ? 'text-yellow-500' : 'text-red-500'}`}>{order.status}</span></p>
                        <div className="flex justify-between">
                            {order.status === 'new' && (
                                <button
                                    onClick={() => updateOrderStatus(order.id, 'in-progress')}
                                    className="bg-yellow-500 text-white py-2 px-4 rounded-md"
                                >
                                    Mark as In Progress
                                </button>
                            )}
                            {order.status === 'in-progress' && (
                                <button
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    className="bg-green-500 text-white py-2 px-4 rounded-md"
                                >
                                    Mark as Completed
                                </button>
                            )}
                            {order.status === 'completed' && (
                                <button
                                    onClick={() => updateOrderStatus(order.id, 'in-progress')}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md"
                                >
                                    Completed
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <Logout link='kitchen' />
        </div>
    )
}
