import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import app from '@/utils/firebaseConfig'

const db = getFirestore(app)
const auth = getAuth(app)


export { db, auth }
