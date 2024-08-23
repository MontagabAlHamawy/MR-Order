'use client'

import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/utils/firestore'
import { Logout } from '@/components/logout'
import { FaBars } from 'react-icons/fa'
import Cart from '@/components/Cart'

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]) //  المنتجات
  const [loading, setLoading] = useState(true) //  التحميل
  const [error, setError] = useState<any>(null) //  الخطأ
  const [cart, setCart] = useState<any[]>([]) //  السلة
  const [cartState, setCartState] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'prodacts') // الوصول إلى المنتجات
        const productsSnapshot = await getDocs(productsCollection)
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProducts(productsList)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p className='text-center mt-10 text-lg'>Loading products...</p>
  if (error) return <p>{error}</p>

  // لإضافة منتج إلى السلة
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      // التحقق من وجود المنتج في السلة 
      const productInCart = prevCart.find((item) => item.id === product.id);

      if (productInCart) {
        // زيادة الكمية فيحال وجود المنتج  
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // اضافة المنتج في  حال عدم وجوده
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="flex">
      <div className={` ${cartState ? "w-full" : "w-1/3 xl:w-2/3"} p-4 relative`}>
        <h1 className={`text-2xl text-center font-bold mb-5 ${cartState ? "" : "hidden xl:block"} `}>Shop</h1>
        <div className='cursor-pointer absolute top-5 right-3 xl:hidden' onClick={() => { setCartState(!cartState) }}><FaBars size={25} /></div>
        <div className={`grid grid-cols-2  xl:grid-cols-3 gap-5 ${cartState ? "" : "hidden xl:grid"}`}>
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
      <Cart cart={cart} updateCart={setCart} cartState={cartState} />
      <Logout link='shop' />
    </div>
  )
}
