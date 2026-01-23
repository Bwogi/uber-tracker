"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Income, Expense, Loan, WorkHours, Mileage } from "@/lib/types";

const MILEAGE_RATE = 0.67;

export default function TaxReportPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState<{
    income: Income[];
    expenses: Expense[];
    loans: Loan[];
    hours: WorkHours[];
    mileage: Mileage[];
  }>({ income: [], expenses: [], loans: [], hours: [], mileage: [] });
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeRes, expensesRes, loansRes, hoursRes, mileageRes] = await Promise.all([
        fetch("/api/income"),
        fetch("/api/expenses"),
        fetch("/api/loans"),
        fetch("/api/hours"),
        fetch("/api/mileage"),
      ]);

      const income = await incomeRes.json();
      const expenses = await expensesRes.json();
      const loans = await loansRes.json();
      const hours = await hoursRes.json();
      const mileageData = await mileageRes.json();

      setData({ 
        income, 
        expenses, 
        loans, 
        hours, 
        mileage: mileageData.entries || [] 
      });
      setGenerated(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByYear = <T extends { date: string }>(items: T[]) => {
    return items.filter((item) => item.date.startsWith(year));
  };

  const filteredData = {
    income: filterByYear(data.income),
    expenses: filterByYear(data.expenses),
    hours: filterByYear(data.hours),
    mileage: filterByYear(data.mileage),
    loans: data.loans,
  };

  // Loan stats
  const loanStats = {
    totalBalance: filteredData.loans.reduce((sum, l) => sum + l.balance, 0),
    totalPaid: filteredData.loans.reduce((sum, l) => sum + l.amount_paid, 0),
    totalPrincipal: filteredData.loans.reduce((sum, l) => sum + l.principal_amount, 0),
    activeLoans: filteredData.loans.filter(l => l.status === 'active').length,
    paidLoans: filteredData.loans.filter(l => l.status === 'paid').length,
  };

  const stats = {
    totalIncome: filteredData.income.reduce((sum, i) => sum + i.amount, 0),
    totalExpenses: filteredData.expenses.reduce((sum, e) => sum + e.amount, 0),
    totalMiles: filteredData.mileage.reduce((sum, m) => sum + m.miles, 0),
    totalHours: filteredData.hours.reduce((sum, h) => sum + h.hours_worked, 0),
    get mileageDeduction() { return this.totalMiles * MILEAGE_RATE; },
    get netProfit() { return this.totalIncome - this.totalExpenses; },
    get netProfitAfterLoans() { return this.totalIncome - this.totalExpenses - loanStats.totalPaid; },
    get taxableIncome() { return Math.max(0, this.totalIncome - this.totalExpenses - this.mileageDeduction); },
  };

  // Group expenses by type
  const expensesByType: Record<string, number> = {};
  filteredData.expenses.forEach((e) => {
    expensesByType[e.type] = (expensesByType[e.type] || 0) + e.amount;
  });

  const generateTaxReport = () => {
    const generatedDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    let report = "";
    
    // Header
    report += `╔════════════════════════════════════════════════════════════╗\n`;
    report += `║                                                            ║\n`;
    report += `║              RIDESHARE TAX SUMMARY - ${year}                 ║\n`;
    report += `║                                                            ║\n`;
    report += `╚════════════════════════════════════════════════════════════╝\n`;
    report += `\n`;

    // Quick Summary Box
    report += `┌─────────────────────────────────────────────────────────────┐\n`;
    report += `│  QUICK SUMMARY                                              │\n`;
    report += `├─────────────────────────────────────────────────────────────┤\n`;
    report += `│  Gross Income:              $${stats.totalIncome.toFixed(2).padStart(10)}                  │\n`;
    report += `│  Total Deductions:          $${(stats.totalExpenses + stats.mileageDeduction).toFixed(2).padStart(10)}                  │\n`;
    report += `│  ─────────────────────────────────────                      │\n`;
    report += `│  TAXABLE INCOME:            $${stats.taxableIncome.toFixed(2).padStart(10)}                  │\n`;
    report += `└─────────────────────────────────────────────────────────────┘\n`;
    report += `\n`;

    // Income
    report += `INCOME\n`;
    report += `────────────────────────────────────────\n`;
    report += `  Rideshare Earnings           $${stats.totalIncome.toFixed(2).padStart(10)}\n`;
    report += `\n`;

    // Expenses
    report += `EXPENSES\n`;
    report += `────────────────────────────────────────\n`;
    if (Object.keys(expensesByType).length === 0) {
      report += `  No expenses recorded\n`;
    } else {
      Object.entries(expensesByType).forEach(([type, amount]) => {
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        report += `  ${label.padEnd(27)} $${amount.toFixed(2).padStart(10)}\n`;
      });
    }
    report += `  ─────────────────────────────────────\n`;
    report += `  Total Expenses               $${stats.totalExpenses.toFixed(2).padStart(10)}\n`;
    report += `\n`;

    // Mileage
    report += `MILEAGE DEDUCTION\n`;
    report += `────────────────────────────────────────\n`;
    report += `  Miles Driven                  ${stats.totalMiles.toFixed(0).padStart(10)} mi\n`;
    report += `  IRS Rate                     $${MILEAGE_RATE.toFixed(2)}/mile\n`;
    report += `  ─────────────────────────────────────\n`;
    report += `  Mileage Deduction            $${stats.mileageDeduction.toFixed(2).padStart(10)}\n`;
    report += `\n`;

    // Work Stats
    report += `WORK STATISTICS\n`;
    report += `────────────────────────────────────────\n`;
    report += `  Days Worked                   ${filteredData.hours.length.toString().padStart(10)}\n`;
    report += `  Hours Worked                  ${stats.totalHours.toFixed(1).padStart(10)}\n`;
    report += `  Hourly Rate (Gross)          $${(stats.totalHours > 0 ? stats.totalIncome / stats.totalHours : 0).toFixed(2).padStart(10)}\n`;
    report += `  Hourly Rate (Net)            $${(stats.totalHours > 0 ? stats.netProfit / stats.totalHours : 0).toFixed(2).padStart(10)}\n`;
    report += `\n`;

    // Loans (if any)
    if (filteredData.loans.length > 0) {
      report += `LOANS\n`;
      report += `────────────────────────────────────────\n`;
      filteredData.loans.forEach((loan) => {
        const status = loan.status === 'paid' ? '✓ Paid' : 'Active';
        report += `  ${loan.name}\n`;
        report += `    Status: ${status}\n`;
        report += `    Principal:                 $${loan.principal_amount.toFixed(2).padStart(10)}\n`;
        report += `    Paid:                      $${loan.amount_paid.toFixed(2).padStart(10)}\n`;
        report += `    Balance:                   $${loan.balance.toFixed(2).padStart(10)}\n`;
        report += `\n`;
      });
      report += `  Total Loan Balance           $${loanStats.totalBalance.toFixed(2).padStart(10)}\n`;
      report += `  Total Paid to Loans          $${loanStats.totalPaid.toFixed(2).padStart(10)}\n`;
      report += `\n`;
    }

    // Final Summary
    report += `════════════════════════════════════════\n`;
    report += `TAX CALCULATION\n`;
    report += `════════════════════════════════════════\n`;
    report += `  Gross Income                 $${stats.totalIncome.toFixed(2).padStart(10)}\n`;
    report += `  Less: Expenses              ($${stats.totalExpenses.toFixed(2).padStart(9)})\n`;
    report += `  Less: Mileage               ($${stats.mileageDeduction.toFixed(2).padStart(9)})\n`;
    report += `  ─────────────────────────────────────\n`;
    report += `  TAXABLE INCOME               $${stats.taxableIncome.toFixed(2).padStart(10)}\n`;
    report += `\n`;

    if (filteredData.loans.length > 0) {
      report += `CASH FLOW (After Loan Payments)\n`;
      report += `────────────────────────────────────────\n`;
      report += `  Net Profit                   $${stats.netProfit.toFixed(2).padStart(10)}\n`;
      report += `  Less: Loan Payments         ($${loanStats.totalPaid.toFixed(2).padStart(9)})\n`;
      report += `  ─────────────────────────────────────\n`;
      report += `  Take-Home                    $${stats.netProfitAfterLoans.toFixed(2).padStart(10)}\n`;
      report += `\n`;
    }

    // Footer
    report += `────────────────────────────────────────\n`;
    report += `Generated: ${generatedDate}\n`;
    report += `\n`;
    report += `This report is for personal records only.\n`;
    report += `Consult a tax professional for filing.\n`;
    report += `IRS Info: irs.gov | Publication 463\n`;

    return report;
  };

  const downloadPDF = () => {
    const content = generateTaxReport();
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Tax Report ${year}</title>
          <style>
            @page { size: A4; margin: 1.5cm; }
            body { font-family: 'Courier New', monospace; font-size: 12pt; line-height: 1.5; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body><pre>${content}</pre></body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  };

  const downloadTXT = () => {
    const content = generateTaxReport();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TaxReport_${year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page Header */}
      <div className="bg-slate-700 dark:bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold">Tax Report Generator</h1>
          <p className="text-slate-300 mt-1">Generate annual tax summaries for your rideshare business</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Year Selection */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
            <h2 className="font-bold text-slate-800 dark:text-white">Select Tax Year</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="year" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tax Year <span className="text-red-600">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  min="2020"
                  max="2030"
                  value={year}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setYear(e.target.value);
                    setGenerated(false);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:self-end">
                <Button 
                  onClick={fetchData} 
                  disabled={loading} 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-semibold px-8"
                >
                  {loading ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {generated && (
          <>
            {/* Tax Summary */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
              <div className="bg-green-600 px-6 py-3">
                <h2 className="font-bold text-white">Tax Year {year} Summary</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <p className="text-green-600 dark:text-green-400 text-xs font-medium">Gross Income</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      ${stats.totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">Mileage Deduction</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      ${stats.mileageDeduction.toFixed(2)}
                    </p>
                    <p className="text-blue-500 text-xs">{stats.totalMiles.toFixed(0)} mi</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 text-xs font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                      ${stats.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                    <p className="text-purple-600 dark:text-purple-400 text-xs font-medium">Taxable Income</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      ${stats.taxableIncome.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Loan Summary */}
                {filteredData.loans.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                      <div>
                        <p className="text-amber-600 dark:text-amber-400 text-xs font-medium">Loan Balance</p>
                        <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                          ${loanStats.totalBalance.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-600 dark:text-amber-400 text-sm">Paid: ${loanStats.totalPaid.toFixed(2)}</p>
                        <p className="text-amber-500 text-xs">{loanStats.activeLoans} active, {loanStats.paidLoans} paid off</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Report Preview */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
              <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
                <h2 className="font-bold text-slate-800 dark:text-white">Report Preview</h2>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-300 dark:border-slate-700 max-h-[400px] overflow-y-auto">
                  <pre className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap font-mono">
                    {generateTaxReport()}
                  </pre>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={downloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print / Save as PDF
              </button>
              <button
                onClick={downloadTXT}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-4 px-6 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download TXT
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>Disclaimer:</strong> This report is for informational purposes only and is not intended as tax advice. 
                Please consult a qualified tax professional for official tax filings and advice specific to your situation.
              </p>
            </div>
          </>
        )}

        {!generated && !loading && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
                Select a tax year and click Generate Report
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                Your complete tax summary will appear here
              </p>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>About This Report:</strong> This tax report aggregates your income, expenses, mileage, and loan data 
            for the selected year. The IRS standard mileage rate for {year} is ${MILEAGE_RATE}/mile. 
            Taxable income is calculated as gross income minus expenses and mileage deduction.
          </p>
        </div>
      </div>
    </div>
  );
}
