import { db } from '../config/firebase';
import { collection, query, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore';

export interface Chore {
  id?: string;
  title: string;
  assignee: string;
  points: number;
  isCompleted: boolean;
}

export class ChoreService {
  private static FAMILY_ID = 'demo_family_001';

  static async getChores(): Promise<Chore[]> {
    const choresRef = collection(db, `families/${this.FAMILY_ID}/chores`);
    const q = query(choresRef); 
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chore));
  }

  static async toggleChore(chore: Chore): Promise<void> {
    if (!chore.id) return;
    const choreRef = doc(db, `families/${this.FAMILY_ID}/chores`, chore.id);
    const familyRef = doc(db, 'families', this.FAMILY_ID);
    await updateDoc(choreRef, {
      isCompleted: !chore.isCompleted,
      lastUpdated: serverTimestamp()
    });
  }
}