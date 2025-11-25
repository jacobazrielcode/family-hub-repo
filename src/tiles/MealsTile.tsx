import React, { useState, useEffect } from 'react';
import { PaprikaService } from '../services/PaprikaService';

const MealsTile: React.FC = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [creds, setCreds] = useState({email: '', password: ''});
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    PaprikaService.getMeals().then(data => {
        const upcoming = data.filter((m: any) => m.type === 2).slice(0,5);
        setMeals(upcoming);
    }).catch(() => setShowLogin(true));
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await PaprikaService.login(creds.email, creds.password);
    setShowLogin(false);
    window.location.reload();
  };

  if(showLogin) return (
    <form onSubmit={handleLogin} className="p-4 flex flex-col gap-2">
        <h3>Connect Paprika</h3>
        <input className="border p-1" placeholder="Email" value={creds.email} onChange={e=>setCreds({...creds, email: e.target.value})} />
        <input className="border p-1" type="password" placeholder="Password" value={creds.password} onChange={e=>setCreds({...creds, password: e.target.value})} />
        <button className="bg-orange-500 text-white p-1 rounded">Login</button>
    </form>
  );

  return (
    <div className="h-full flex flex-col p-4 bg-orange-50">
      <h2 className="text-xl font-bold text-orange-800 mb-2">Dinner Menu</h2>
      <div className="space-y-2">
        {meals.map((m: any, i) => (
           <a key={i} href={PaprikaService.getDeepLink(m.recipe_uid)} className="block p-2 bg-white rounded shadow-sm">
             <div className="font-bold">{m.name}</div>
             <div className="text-xs text-gray-500">{new Date(m.date).toLocaleDateString()}</div>
           </a>
        ))}
      </div>
    </div>
  );
};
export default MealsTile;