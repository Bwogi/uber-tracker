"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600 dark:text-red-400">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Income",
      value: `$${stats.totalIncome.toFixed(2)}`,
      description: "Total Uber earnings",
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Expenses",
      value: `$${stats.totalExpenses.toFixed(2)}`,
      description: `Charging: $${stats.chargingExpenses.toFixed(2)} | Other: $${stats.otherExpenses.toFixed(2)}`,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Active Loans",
      value: `$${stats.totalLoans.toFixed(2)}`,
      description: `Paid so far: $${stats.loansPaid.toFixed(2)}`,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Net Profit",
      value: `$${stats.netProfit.toFixed(2)}`,
      description: "Income - Expenses - Loan Payments",
      color: stats.netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
    },
    {
      title: "Total Hours Worked",
      value: stats.totalHoursWorked.toFixed(1),
      description: "Total driving hours",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Hourly Rate",
      value: stats.totalHoursWorked > 0 ? `$${(stats.totalIncome / stats.totalHoursWorked).toFixed(2)}/hr` : "$0/hr",
      description: "Income per hour",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your Uber finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardTitle className="text-lg mb-1">{card.title}</CardTitle>
            <p className={`text-3xl font-bold mb-2 ${card.color}`}>
              {card.value}
            </p>
            <CardDescription>{card.description}</CardDescription>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Quick Stats</CardTitle>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
              <span className="text-gray-900 dark:text-white font-semibold">${stats.totalIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Costs</span>
              <span className="text-gray-900 dark:text-white font-semibold">${(stats.totalExpenses + stats.loansPaid).toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-800"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 font-bold">Net Profit</span>
              <span className={`font-bold text-lg ${stats.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${stats.netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Financial Health</CardTitle>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Profit Margin</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {stats.totalIncome > 0 ? ((stats.netProfit / stats.totalIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Expense Ratio</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {stats.totalIncome > 0 ? ((stats.totalExpenses / stats.totalIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Loan Burden</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {stats.totalIncome > 0 ? ((stats.loansPaid / stats.totalIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
