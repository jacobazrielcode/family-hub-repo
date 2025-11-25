import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ChoreService, Chore } from '../services/ChoreService';
import { FinanceService } from '../services/FinanceService';

const ChoresTile: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([]);

  useEffect(() => {
    ChoreService.getChores().then(setChores);
  }, []);

  const handleToggle = async (chore: Chore) => {
    setChores(chores.map(c => c.id === chore.id ? { ...c, isCompleted: !c.isCompleted } : c));
    if (!chore.isCompleted) {
        confetti({ particleCount: 50, spread: 60, origin: { x: 0.7, y: 0.5 } });
        FinanceService.addTransaction({ familyMemberId: chore.assignee, amount: chore.points, description: `Chore: ${chore.title}` });
    }
    await ChoreService.toggleChore(chore);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-white">
      <h2 className="text-xl font-bold mb-2">Chores</h2>
      <div className="flex-1 overflow-y-auto space-y-2">
        {chores.map(chore => (
          <div key={chore.id} onClick={() => handleToggle(chore)} className={`p-2 border rounded cursor-pointer ${chore.isCompleted ? 'bg-green-50' : ''}`}>
             <div className="font-bold">{chore.title}</div>
             <div className="text-xs text-gray-500">{chore.points} pts - {chore.assignee}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ChoresTile;