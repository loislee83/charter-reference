// ─── Firebase Configuration ───────────────────────────────────────────────────
// 1. Go to console.firebase.google.com
// 2. Create a project → Add web app → Copy the config below
// 3. Replace the placeholder values with your actual config

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// ─── Custom Riders CRUD ───────────────────────────────────────────────────────

export async function loadCustomRiders() {
  try {
    const snapshot = await getDocs(collection(db, 'customRiders'))
    return snapshot.docs.map(d => ({ ...d.data(), firestoreId: d.id }))
  } catch (err) {
    console.warn('Firebase load failed, falling back to localStorage:', err)
    try {
      const s = localStorage.getItem('charter_custom_riders')
      return s ? JSON.parse(s) : []
    } catch {
      return []
    }
  }
}

export async function saveCustomRider(clause) {
  try {
    const docRef = await addDoc(collection(db, 'customRiders'), clause)
    return { ...clause, firestoreId: docRef.id }
  } catch (err) {
    console.warn('Firebase save failed, falling back to localStorage:', err)
    return null
  }
}

export async function deleteCustomRider(firestoreId) {
  try {
    await deleteDoc(doc(db, 'customRiders', firestoreId))
    return true
  } catch (err) {
    console.warn('Firebase delete failed:', err)
    return false
  }
}
