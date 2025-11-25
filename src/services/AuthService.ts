import { auth } from '../config/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/userinfo.email'
];

export class AuthService {
  private static isExtension(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.identity;
  }

  static async getAuthToken(): Promise<string> {
    if (this.isExtension()) {
      return this.getExtensionToken();
    } else {
      return this.getWebToken();
    }
  }

  private static getExtensionToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError || !token) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });
  }

  private static async getWebToken(): Promise<string> {
    const provider = new GoogleAuthProvider();
    SCOPES.forEach(scope => provider.addScope(scope));
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      return credential?.accessToken || "";
    } catch (error) {
      console.error("PWA Login Error", error);
      throw error;
    }
  }

  static async getUserProfile() {
    if (this.isExtension()) {
      const token = await this.getExtensionToken();
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return await response.json();
    } else {
      if (!auth.currentUser) throw new Error("Not logged in");
      return auth.currentUser;
    }
  }
}