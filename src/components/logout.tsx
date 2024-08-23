"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/utils/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Logout({ link }: { link: string }) {
  const [user, loading] = useAuthState(auth); // استرجاع حالة المستخدم والحالة التحميل
  const router = useRouter();

  useEffect(() => {
    if (!loading) { // تأكد من انتهاء تحميل البيانات
      if (user) {
        router.push(`/${link}`); // التوجيه إذا كان المستخدم مسجلاً
      } else {
        router.push('/login'); // التوجيه إذا لم يكن المستخدم مسجلاً
      }
    }
  }, [user, loading, link, router]);

  return null;
}
