'use client'

import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/utils/firestore'
import Cart from '@/components/Cart'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation'
import { Logout } from '@/components/logout'

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]) // حالة لتخزين المنتجات
  const [loading, setLoading] = useState(true) // حالة التحميل
  const [error, setError] = useState<any>(null) // حالة الخطأ
  const [cart, setCart] = useState<any[]>([]) // حالة السلة
  Logout('shop')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'prodacts') // الوصول إلى مجموعة المنتجات
        const productsSnapshot = await getDocs(productsCollection) // جلب المستندات
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) // تحويل البيانات إلى مصفوفة من الكائنات
        setProducts(productsList) // تحديث حالة المنتجات
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false) // إنهاء حالة التحميل
      }
    }

    fetchProducts()
  }, []) // يتم تشغيلها مرة واحدة عند تحميل المكون

  if (loading) return <p className='text-center mt-10 text-lg'>Loading products...</p> // عرض رسالة التحميل
  if (error) return <p>{error}</p> // عرض رسالة الخطأ

  // دالة لإضافة منتج إلى السلة
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      // التحقق من وجود المنتج في السلة بالفعل
      const productInCart = prevCart.find((item) => item.id === product.id);

      if (productInCart) {
        // إذا كان المنتج موجودًا، قم بزيادة الكمية
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // إذا لم يكن المنتج موجودًا، أضفه إلى السلة
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="flex">
      <div className="w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-5">Shop</h1>
        <div className='grid grid-cols-3 gap-5'>
          {products.map((product: any) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className='cursor-pointer hover:bg-[#1c1a46] flex flex-col justify-start items-center p-4 bg-[#1a1938] rounded-md gap-2'
            >
              <h1 className='text-xl font-semibold text-white'>{product.name}</h1>
              <p className='text-md text-gray-200 font-thin'>{product.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Cart cart={cart} updateCart={setCart} />
    </div>
  )
}
