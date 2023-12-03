import React from 'react';
import { AddTransaction } from '../components/Transactions/AddTransaction';

const Page: React.FC = () => {
  return (
    <div className="relative w-full h-[calc(100vh-3rem)]">
      <h1>Dashboard</h1>
      <AddTransaction />
    </div>
  );
};

export default Page;
