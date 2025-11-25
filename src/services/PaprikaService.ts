import pako from 'pako';
const BASE_URL = 'https://www.paprikaapp.com/api/v1';

export class PaprikaService {
  static async login(email: string, password: string): Promise<string> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    const response = await fetch(`${BASE_URL}/account/login/`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Paprika Login Failed');
    const data = await response.json();
    localStorage.setItem('paprika_token', data.result.token);
    return data.result.token;
  }

  static async getMeals(): Promise<any[]> {
    const token = localStorage.getItem('paprika_token');
    if (!token) throw new Error("Not logged in");
    const response = await fetch(`${BASE_URL}/sync/meals/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    try {
      const decompressed = pako.ungzip(new Uint8Array(arrayBuffer), { to: 'string' });
      return JSON.parse(decompressed);
    } catch (err) {
      return [];
    }
  }

  static getDeepLink(recipeUid?: string): string {
    return recipeUid ? `paprika://recipe/${recipeUid}` : `paprika://`;
  }
}