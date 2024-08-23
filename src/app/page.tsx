'use client'
import { Logout } from "@/components/logout";
import { auth } from "@/utils/firestore";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Home() {

  return (
    <div>
      {/* لعملية إعادة التوجيه  */}
      <Logout link='shop' />
    </div>
  );
}
