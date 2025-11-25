import React, { useState, useEffect } from 'react';
import { FinanceService, Transaction } from '../services/FinanceService';
import { FamilyIdentity, FamilyMember } from '../utils/FamilyIdentity';

const BankTile: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    FamilyIdentity.getFamilyMapping().then(m => {
      setMembers(m);
      if(m.length > 0) setSelectedMember(m[1].name); 
    });
  }, []);

  useEffect(() => {
    if (!selectedMember) return;
    const unsubscribe = FinanceService.subscribeToTransactions(selectedMember, (txs) => {
      setTransactions(txs);
      const total = txs.reduce((acc, curr) => acc + curr.amount, 0);
      setBalance(total);
    });
    return () => unsubscribe();
  }, [selectedMember]);

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="bg-emerald-600 p-4 text-white shadow-md flex justify-between items-center">
        <h2 className="font-mono text-xl font-bold tracking-widest">FAMILY BANK</h2>
        <div className="font-mono text-2xl font-bold">${balance.toFixed(2)}</div>
      </div>
      <div className="flex bg-emerald-700 overflow-x-auto">
        {members.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMember(m.name)}
            className={`px-4 py-2 text-xs font-bold uppercase ${selectedMember === m.name ? 'bg-white text-emerald-800' : 'text-emerald-100'}`}
          >
            {m.name}
          </button>
        ))}
      </div>
      <div className="flex-1 bg-yellow-50 p-4 overflow-y-auto font-mono text-sm">
        {transactions.map(tx => (
          <div key={tx.id} className="flex justify-between border-b border-gray-200/50 py-2">
            <span>{tx.description}</span>
            <span className={tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}>{tx.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BankTile;