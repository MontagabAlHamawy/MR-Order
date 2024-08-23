
import React from 'react'
import { auth, db } from '@/utils/firestore'
import { collection, addDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'


export default function Cart({ cart, updateCart }: any) {
    const router = useRouter()
    const removeFromCart = (id: string) => {
        updateCart((prevCart: any[]) => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, amount: number) => {
        updateCart((prevCart: any[]) =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + amount } : item
            )
        );
    };

    const placeOrder = async () => {
        try {
            const user = auth.currentUser;

            if (!user) {
                alert('Please log in to place an order.');
                return;
            }

            // إنشاء مستند جديد في Firestore
            await addDoc(collection(db, 'orders'), {
                userId: user.uid,
                userEmail: user.email,
                products: cart.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                })),
                status: 'new', // حالة الطلب الجديدة
                timestamp: new Date(),
            });

            // إعادة تعيين السلة بعد تقديم الطلب
            toast.success('Order placed successfully!');
            updateCart([]);


            router.push('/shop/order');  // تأكد من وجود شرطة مائلة قبل `shop/order`

        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };
    return (
        <div className="w-1/3 p-4 bg-[#1a1938] text-white sticky right-0 top-0 h-[90vh]">
            <h1 className="text-2xl font-bold mb-5">Cart</h1>
            <div className='space-y-4'>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cart.map((car: any) => (
                        <div key={car.id} className='flex flex-row justify-between items-center p-2 border border-gray-600 rounded-md bg-[#2a2950]'>
                            <div className="flex-1">
                                <h2 className='text-lg font-semibold'>{car.name}</h2>
                                <p className='text-sm text-gray-400'>{car.description}</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => updateQuantity(car.id, -1)}
                                        disabled={car.quantity === 1}
                                        className="px-2 py-1 bg-red-500 text-white rounded-md disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <span className='mx-2 text-lg'>{car.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(car.id, 1)}
                                        className="px-2 py-1 bg-green-500 text-white rounded-md"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(car.id)}
                                className='ml-4 bg-red-500 px-3 py-1 rounded-md text-white'
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}

                {cart.length > 0 && (
                    <button
                        onClick={placeOrder}
                        className='w-full mt-5 py-2 bg-blue-500 text-white rounded-md'
                    >
                        Place Order
                    </button>
                )}
            </div>
        </div>
    )
}
