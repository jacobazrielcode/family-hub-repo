import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { FamilyIdentity, FamilyMember } from '../utils/FamilyIdentity';

const CalendarTile: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await AuthService.getAuthToken();
        const now = new Date().toISOString();
        const next = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&timeMax=${next}&singleEvents=true&orderBy=startTime`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        const members = await FamilyIdentity.getFamilyMapping();
        setEvents(data.items.map((e: any) => FamilyIdentity.assignMemberToEvent(e, members)));
      } catch (error) { console.error(error); }
    };
    loadData();
  }, []);

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4">Calendar</h2>
      <div className="flex-1 overflow-y-auto space-y-2">
        {events.map((evt: any) => (
          <div key={evt.id} className="p-2 rounded border-l-4 bg-gray-50" style={{ borderLeftColor: evt.displayColor }}>
            <div className="font-bold">{evt.summary}</div>
            <div className="text-xs text-gray-500">{new Date(evt.start.dateTime || evt.start.date).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CalendarTile;