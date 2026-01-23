"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-slate-600 dark:text-slate-400">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="border-l-4 border-red-600 bg-red-50 dark:bg-red-950 p-4">
            <p className="text-red-800 dark:text-red-200 font-medium">Error: Failed to load statistics</p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">Please refresh the page or try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page Header */}
      <div className="bg-slate-700 dark:bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Financial Dashboard</h1>
              <p className="text-slate-300 mt-1">Summary of your rideshare earnings and expenses</p>
            </div>
            <Link href="/log">
              <Button className="bg-blue-600 hover:bg-blue-700 font-semibold">
                + Log Entry
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Primary Metric: Net Profit */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
            <h2 className="font-bold text-slate-800 dark:text-white">Net Profit Summary</h2>
          </div>
          <div className="p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Total Net Profit (After All Expenses)</p>
            <p className={`text-5xl font-bold ${stats.netProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              ${stats.netProfit.toFixed(2)}
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-3">
              Gross income minus expenses and loan payments
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* True Hourly Rate */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="bg-blue-600 px-4 py-2">
              <p className="text-white text-sm font-medium">True Hourly Rate</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                ${stats.trueHourlyRate.toFixed(2)}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">per hour worked</p>
            </div>
          </div>

          {/* Mileage Deduction */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="bg-blue-600 px-4 py-2">
              <p className="text-white text-sm font-medium">IRS Mileage Deduction</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                ${stats.mileageDeduction.toFixed(2)}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                {stats.totalMiles.toFixed(0)} miles × $0.67
              </p>
            </div>
          </div>

          {/* Total Hours */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="bg-slate-600 px-4 py-2">
              <p className="text-white text-sm font-medium">Hours Worked</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats.totalHoursWorked.toFixed(1)}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">total hours</p>
            </div>
          </div>

          {/* Total Miles */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="bg-slate-600 px-4 py-2">
              <p className="text-white text-sm font-medium">Miles Driven</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats.totalMiles.toFixed(0)}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">total miles</p>
            </div>
          </div>
        </div>

        {/* Loan Status */}
        {stats.totalLoans > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="bg-amber-600 px-6 py-3">
              <h2 className="font-bold text-white">Loan Status</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                    ${stats.totalLoans.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Total Paid</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    ${stats.loansPaid.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Income to Loans</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {stats.loanPercentOfIncome.toFixed(0)}%
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Payoff Progress</span>
                  <span>{((stats.loansPaid / (stats.loansPaid + stats.totalLoans)) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${Math.min(100, (stats.loansPaid / (stats.loansPaid + stats.totalLoans)) * 100)}%` }}
                  />
                </div>
                {stats.monthsToPayoff > 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                    Estimated payoff: ~{stats.monthsToPayoff} months at current rate
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Financial Breakdown */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
            <h2 className="font-bold text-slate-800 dark:text-white">Financial Breakdown</h2>
          </div>
          <div className="p-6">
            <table className="w-full">
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr>
                  <td className="py-3 text-slate-600 dark:text-slate-400">Gross Income</td>
                  <td className="py-3 text-right font-semibold text-green-700 dark:text-green-400">
                    +${stats.totalIncome.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-600 dark:text-slate-400">Total Expenses</td>
                  <td className="py-3 text-right font-semibold text-red-700 dark:text-red-400">
                    -${stats.totalExpenses.toFixed(2)}
                  </td>
                </tr>
                {stats.loansPaid > 0 && (
                  <tr>
                    <td className="py-3 text-slate-600 dark:text-slate-400">Loan Payments</td>
                    <td className="py-3 text-right font-semibold text-amber-700 dark:text-amber-400">
                      -${stats.loansPaid.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50 dark:bg-slate-700">
                  <td className="py-3 font-bold text-slate-800 dark:text-white">Net Profit</td>
                  <td className={`py-3 text-right font-bold text-lg ${stats.netProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    ${stats.netProfit.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Link href="/log" className="block">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-500 transition-colors">
              <p className="font-bold text-slate-800 dark:text-white">Log Entry</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Record daily income and expenses</p>
            </div>
          </Link>
          <Link href="/reports" className="block">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-500 transition-colors">
              <p className="font-bold text-slate-800 dark:text-white">Tax Report</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Generate tax-ready summaries</p>
            </div>
          </Link>
          <Link href="/loans" className="block">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-500 transition-colors">
              <p className="font-bold text-slate-800 dark:text-white">Manage Loans</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Track payments and balances</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
