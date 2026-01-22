import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { DashboardStats } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get total income
    const incomeResult = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM income').get() as { total: number } | undefined;
    const totalIncome = incomeResult?.total || 0;

    // Get total expenses
    const expensesResult = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses').get() as { total: number } | undefined;
    const totalExpenses = expensesResult?.total || 0;

    // Get charging expenses
    const chargingResult = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE type = 'charging'").get() as { total: number } | undefined;
    const chargingExpenses = chargingResult?.total || 0;

    // Get other expenses
    const otherExpensesResult = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE type = 'other'").get() as { total: number } | undefined;
    const otherExpenses = otherExpensesResult?.total || 0;

    // Get total loan balance
    const loansResult = db.prepare("SELECT COALESCE(SUM(balance), 0) as total FROM loans WHERE status = 'active'").get() as { total: number } | undefined;
    const totalLoans = loansResult?.total || 0;

    // Get total amount paid towards loans
    const loansPaidResult = db.prepare('SELECT COALESCE(SUM(amount_paid), 0) as total FROM loans').get() as { total: number } | undefined;
    const loansPaid = loansPaidResult?.total || 0;

    // Get total hours worked
    const hoursResult = db.prepare('SELECT COALESCE(SUM(hours_worked), 0) as total FROM work_hours').get() as { total: number } | undefined;
    const totalHoursWorked = hoursResult?.total || 0;

    // Calculate net profit (income - expenses - loan payments)
    const netProfit = totalIncome - totalExpenses - loansPaid;

    const stats: DashboardStats = {
      totalIncome,
      totalExpenses,
      totalLoans,
      loansPaid,
      netProfit,
      totalHoursWorked,
      chargingExpenses,
      otherExpenses,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
