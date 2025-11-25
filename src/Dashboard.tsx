import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useMediaQuery } from 'react-responsive';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import CalendarTile from './tiles/CalendarTile';
import ChoresTile from './tiles/ChoresTile';
import MealsTile from './tiles/MealsTile';
import PhotoFrameTile from './tiles/PhotoFrameTile';
import BankTile from './tiles/BankTile';
import MaintenanceTile from './tiles/MaintenanceTile';
import { AuthService } from './services/AuthService';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isIdle, setIsIdle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Auth Check
  useEffect(() => {
    AuthService.getUserProfile()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Idle Timer (Screensaver)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsIdle(true), 300000); // 5 mins
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  if (isIdle) return <PhotoFrameTile />;

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-700">FamilyHub</h1>
        <button 
          onClick={() => AuthService.getAuthToken().then(() => setIsLoggedIn(true))}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  // Mobile Stack Layout
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4 p-4 bg-gray-100 min-h-screen pb-20">
         <div className="h-96 rounded-xl overflow-hidden shadow bg-white"><CalendarTile /></div>
         <div className="h-64 rounded-xl overflow-hidden shadow bg-white"><ChoresTile /></div>
         <div className="h-48 rounded-xl overflow-hidden shadow bg-white"><MealsTile /></div>
         <div className="h-48 rounded-xl overflow-hidden shadow bg-white"><BankTile /></div>
      </div>
    );
  }

  // Desktop Grid Layout
  const layout = {
    lg: [
      { i: 'calendar', x: 0, y: 0, w: 6, h: 12 },
      { i: 'chores',   x: 6, y: 0, w: 3, h: 6 },
      { i: 'bank',     x: 9, y: 0, w: 3, h: 6 },
      { i: 'meals',    x: 6, y: 6, w: 3, h: 6 },
      { i: 'maint',    x: 9, y: 6, w: 3, h: 6 },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">The Smith Family</h1>
        <div className="text-xl text-gray-600">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      </header>
      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        isDraggable={false}
        isResizable={false}
      >
        <div key="calendar" className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"><CalendarTile /></div>
        <div key="chores" className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"><ChoresTile /></div>
        <div key="bank" className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"><BankTile /></div>
        <div key="meals" className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"><MealsTile /></div>
        <div key="maint" className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"><MaintenanceTile /></div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;