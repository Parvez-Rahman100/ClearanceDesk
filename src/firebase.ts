import { getApp, getApps, initializeApp } from 'firebase/app';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import type { ClearanceOrder } from './types';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.projectId && config.appId);
const db = firebaseEnabled
  ? getFirestore(getApps().length ? getApp() : initializeApp(config))
  : null;

export async function loadRemoteOrders(): Promise<ClearanceOrder[] | null> {
  if (!db) return null;
  const snapshot = await getDocs(collection(db, 'deliveries'));
  return snapshot.docs.map((orderDoc) => orderDoc.data() as ClearanceOrder);
}

export async function saveRemoteOrder(order: ClearanceOrder): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'deliveries', order.id), order);
}

export async function deleteRemoteOrder(orderId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'deliveries', orderId));
}
