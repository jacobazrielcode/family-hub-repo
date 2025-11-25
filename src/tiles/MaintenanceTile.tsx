import React from 'react';

const MOCK_ASSETS = [
  { id: 1, name: "HVAC Filter", lastDone: "2023-09-01", intervalDays: 90 },
  { id: 2, name: "Smoke Alarm", lastDone: "2023-01-15", intervalDays: 365 },
];

const MaintenanceTile: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Home Health</h2>
      <div className="space-y-4">
        {MOCK_ASSETS.map(asset => (
            <div key={asset.id} className="bg-gray-800 p-3 rounded">
                <div className="font-bold">{asset.name}</div>
                <div className="text-xs text-gray-400">Interval: {asset.intervalDays} days</div>
            </div>
        ))}
      </div>
    </div>
  );
};
export default MaintenanceTile;