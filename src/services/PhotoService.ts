import { AuthService } from './AuthService';

export interface Photo {
  id: string;
  baseUrl: string;
}

export class PhotoService {
  static async getRecentPhotos(): Promise<Photo[]> {
    const token = await AuthService.getAuthToken();
    const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageSize: 20,
        filters: { mediaTypeFilter: { mediaTypes: ['PHOTO'] } }
      })
    });
    const data = await response.json();
    return data.mediaItems || [];
  }
}