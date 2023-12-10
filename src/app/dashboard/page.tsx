import React from 'react';
import { AddTransaction } from '../components/Transactions/AddTransaction';
import { MonthlyBudgetCard } from '../components/Cards/MonthlyBudget';

const Page: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-2 p-2">
      <MonthlyBudgetCard />

      <AddTransaction />
    </div>
  );
};

export default Page;
