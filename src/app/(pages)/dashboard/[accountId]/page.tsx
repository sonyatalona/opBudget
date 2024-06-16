'use server';
import React from 'react';
import { AddTransaction } from '../../../components/Transactions/AddTransaction';
import { MonthlyBudgetCard } from '../../../components/Cards/MonthlyBudget';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from '@/lib';
import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';
import type { Record as RecordType } from '@prisma/client';

const hasRedirectSearchParam = (searchParams: Record<string, string>) => {
  return !!searchParams.redirected || !!searchParams.from;
};

const Dashboard = async ({
  params,
  searchParams,
}: {
  params: {
    accountId: string;
  };
  searchParams: Record<string, string>;
}) => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions());

  if (!session || !session.isLoggedIn) {
    return redirect('/');
  }
  const userId = session.userId;

  if (hasRedirectSearchParam(searchParams)) {
    return redirect(`/dashboard/${userId}`);
  }

  if (userId !== params?.accountId) {
    return redirect(`/dashboard/${userId}?redirected=true`);
  }

  if (session.status === 'BLOCKED') {
    return redirect('https://www.google.com/search?q=take+some+break');
  }

  const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const thisMonthRecords = await prisma.record.findMany({
    where: {
      userId,
      type: 'EXPENSE',
      createdAt: {
        gte: firstDayOfCurrentMonth,
      },
    },
  });

  const allUsedCategories = thisMonthRecords.reduce((acc: number[], curr: { category: number; type: string }) => {
    if (!acc.includes(curr.category) && curr.type === 'EXPENSE') {
      acc.push(curr.category);
    }
    return acc;
  }, [] as string[]);

  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: allUsedCategories,
      },
    },
  });

  const sumByCategory = categories.map((category: RecordType) => {
    const sum = thisMonthRecords.reduce((acc: number, curr: RecordType) => {
      if (curr.category === category.id) {
        acc += curr.amount;
      }
      return acc;
    }, 0);
    return {
      id: category.id.toString(),
      label: category.name,
      value: sum,
    };
  });

  const budgetLeft =
    session.budget ?? 500 - sumByCategory.reduce((acc: number, curr: { value: number }) => acc + curr.value, 0);

  return (
    <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 p-2">
      <MonthlyBudgetCard currency={session.currency} budget={budgetLeft} records={sumByCategory} />

      <AddTransaction />
    </div>
  );
};

export default Dashboard;
