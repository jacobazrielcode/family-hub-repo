import React, { useEffect, useState } from 'react';
import { PhotoService, Photo } from '../services/PhotoService';

const PhotoFrameTile: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    PhotoService.getRecentPhotos().then(setPhotos);
  }, []);

  useEffect(() => {
    if(photos.length) {
        const t = setInterval(() => setIndex(i => (i+1)%photos.length), 10000);
        return () => clearInterval(t);
    }
  }, [photos]);

  if(!photos.length) return <div className="fixed inset-0 bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <img src={`${photos[index].baseUrl}=w2048-h1024`} className="max-w-full max-h-screen" />
      <div className="absolute bottom-10 right-10 text-white text-6xl font-thin">{new Date().toLocaleTimeString()}</div>
    </div>
  );
};
export default PhotoFrameTile;