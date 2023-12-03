import React from 'react';
import { AddTransaction } from '../components/Transactions/AddTransaction';
import { Typography } from '@mui/joy';

const Page: React.FC = () => {
  return (
    <div className="relative w-full h-[calc(100vh-3rem)]">
      <Typography> Dashboard </Typography>
      <AddTransaction />
    </div>
  );
};

export default Page;
