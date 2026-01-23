import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { DashboardStats } from '@/lib/types';

export const dynamic = 'force-dynamic';

// IRS standard mileage rate for 2024
const MILEAGE_RATE = 0.67;

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

    // Get total miles driven
    const milesResult = db.prepare('SELECT COALESCE(SUM(miles), 0) as total FROM mileage').get() as { total: number } | undefined;
    const totalMiles = milesResult?.total || 0;

    // Calculate mileage deduction
    const mileageDeduction = totalMiles * MILEAGE_RATE;

    // Calculate net profit (income - expenses - loan payments)
    const netProfit = totalIncome - totalExpenses - loansPaid;

    // Calculate true hourly rate (net profit / hours worked)
    const trueHourlyRate = totalHoursWorked > 0 ? netProfit / totalHoursWorked : 0;

    // Calculate loan burden as percentage of income
    const loanPercentOfIncome = totalIncome > 0 ? (loansPaid / totalIncome) * 100 : 0;

    // Calculate months to payoff (assuming current monthly net profit rate)
    // Get income from last 30 days to estimate monthly rate
    const monthlyIncomeResult = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM income 
      WHERE date >= date('now', '-30 days')
    `).get() as { total: number } | undefined;
    const monthlyIncome = monthlyIncomeResult?.total || 0;

    const monthlyExpensesResult = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM expenses 
      WHERE date >= date('now', '-30 days')
    `).get() as { total: number } | undefined;
    const monthlyExpenses = monthlyExpensesResult?.total || 0;

    const monthlyNetProfit = monthlyIncome - monthlyExpenses;
    const monthsToPayoff = monthlyNetProfit > 0 && totalLoans > 0 
      ? Math.ceil(totalLoans / monthlyNetProfit) 
      : 0;

    const stats: DashboardStats = {
      totalIncome,
      totalExpenses,
      totalLoans,
      loansPaid,
      netProfit,
      totalHoursWorked,
      chargingExpenses,
      otherExpenses,
      totalMiles,
      mileageDeduction,
      trueHourlyRate,
      loanPercentOfIncome,
      monthsToPayoff,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
