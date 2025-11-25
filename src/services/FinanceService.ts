import { db } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

export interface Transaction {
  id?: string;
  familyMemberId: string;
  amount: number;
  description: string;
  timestamp: any;
}

export class FinanceService {
  private static FAMILY_ID = 'demo_family_001';

  static subscribeToTransactions(memberId: string, callback: (txs: Transaction[]) => void) {
    const ref = collection(db, `families/${this.FAMILY_ID}/transactions`);
    const q = query(
      ref, 
      where("familyMemberId", "==", memberId), 
      orderBy("timestamp", "desc"), 
      limit(10)
    );
    return onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      callback(txs);
    });
  }

  static async addTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>) {
    await addDoc(collection(db, `families/${this.FAMILY_ID}/transactions`), {
      ...tx,
      timestamp: new Date()
    });
  }
}