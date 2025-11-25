import { db } from '../config/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

export interface Meal {
  date: string;
  type: 'dinner' | 'lunch';
  recipeName: string;
  url?: string;
}

export class MealService {
  private static FAMILY_ID = 'demo_family_001';

  static async getWeeklyMeals(startDate: string, endDate: string): Promise<Meal[]> {
    const mealsRef = collection(db, `families/${this.FAMILY_ID}/meals`);
    const q = query(mealsRef, where("date", ">=", startDate), where("date", "<=", endDate));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Meal);
  }
}