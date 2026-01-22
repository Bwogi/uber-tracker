"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Income, Expense, Loan, WorkHours } from "@/lib/types";

type ReportType = "income" | "expenses" | "loans" | "hours" | "summary";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("summary");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<{
    income: Income[];
    expenses: Expense[];
    loans: Loan[];
    hours: WorkHours[];
  }>({ income: [], expenses: [], loans: [], hours: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(lastDay.toISOString().split("T")[0]);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeRes, expensesRes, loansRes, hoursRes] = await Promise.all([
        fetch("/api/income"),
        fetch("/api/expenses"),
        fetch("/api/loans"),
        fetch("/api/hours"),
      ]);

      const income = await incomeRes.json();
      const expenses = await expensesRes.json();
      const loans = await loansRes.json();
      const hours = await hoursRes.json();

      setData({ income, expenses, loans, hours });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const filterByDate = <T extends { date: string }>(items: T[]) => {
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });
  };

  const filteredData = {
    income: filterByDate(data.income),
    expenses: filterByDate(data.expenses),
    hours: filterByDate(data.hours),
    loans: data.loans,
  };

  const calculateStats = () => {
    const totalIncome = filteredData.income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = filteredData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const chargingExpenses = filteredData.expenses
      .filter((e) => e.type === "charging")
      .reduce((sum, e) => sum + e.amount, 0);
    const otherExpenses = filteredData.expenses
      .filter((e) => e.type === "other")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalHours = filteredData.hours.reduce((sum, h) => sum + h.hours_worked, 0);
    const totalLoans = filteredData.loans.reduce((sum, l) => sum + l.balance, 0);
    const loansPaid = filteredData.loans.reduce((sum, l) => sum + l.amount_paid, 0);
    const netProfit = totalIncome - totalExpenses;
    const hourlyRate = totalHours > 0 ? totalIncome / totalHours : 0;

    return {
      totalIncome,
      totalExpenses,
      chargingExpenses,
      otherExpenses,
      totalHours,
      totalLoans,
      loansPaid,
      netProfit,
      hourlyRate,
    };
  };

  const stats = calculateStats();

  const generateReport = () => {
    let reportContent = "";
    const dateRange = `${startDate} to ${endDate}`;

    // Header with overall summary
    reportContent += `UBER TRACKER FINANCIAL REPORT\n`;
    reportContent += `Period: ${dateRange}\n`;
    reportContent += "=".repeat(60) + "\n\n";

    if (reportType === "summary" || reportType === "income") {
      reportContent += `INCOME REPORT\n`;
      reportContent += "-".repeat(60) + "\n";
      if (filteredData.income.length === 0) {
        reportContent += `No income recorded for this period.\n\n`;
      } else {
        filteredData.income.forEach((item) => {
          reportContent += `${item.date}  |  $${item.amount.toFixed(2).padStart(10)}`;
          if (item.notes) reportContent += `  |  ${item.notes}`;
          reportContent += "\n";
        });
        reportContent += "-".repeat(60) + "\n";
        reportContent += `Total Income: $${stats.totalIncome.toFixed(2)}\n`;
        reportContent += `Number of Entries: ${filteredData.income.length}\n`;
        reportContent += `Average per Entry: $${(stats.totalIncome / filteredData.income.length).toFixed(2)}\n\n`;
      }
    }

    if (reportType === "summary" || reportType === "expenses") {
      reportContent += `EXPENSES REPORT\n`;
      reportContent += "-".repeat(60) + "\n";
      if (filteredData.expenses.length === 0) {
        reportContent += `No expenses recorded for this period.\n\n`;
      } else {
        filteredData.expenses.forEach((item) => {
          reportContent += `${item.date}  |  ${item.type.padEnd(10)}  |  $${item.amount.toFixed(2).padStart(10)}`;
          if (item.notes) reportContent += `  |  ${item.notes}`;
          reportContent += "\n";
        });
        reportContent += "-".repeat(60) + "\n";
        reportContent += `Total Expenses: $${stats.totalExpenses.toFixed(2)}\n`;
        reportContent += `  - Charging: $${stats.chargingExpenses.toFixed(2)} (${stats.totalExpenses > 0 ? ((stats.chargingExpenses / stats.totalExpenses) * 100).toFixed(1) : 0}%)\n`;
        reportContent += `  - Other: $${stats.otherExpenses.toFixed(2)} (${stats.totalExpenses > 0 ? ((stats.otherExpenses / stats.totalExpenses) * 100).toFixed(1) : 0}%)\n`;
        reportContent += `Average per Day: $${(stats.totalExpenses / Math.max(1, new Date(endDate).getDate() - new Date(startDate).getDate() + 1)).toFixed(2)}\n\n`;
      }
    }

    if (reportType === "summary" || reportType === "loans") {
      reportContent += `LOANS REPORT\n`;
      reportContent += "-".repeat(60) + "\n";
      if (filteredData.loans.length === 0) {
        reportContent += `No loans recorded.\n\n`;
      } else {
        filteredData.loans.forEach((item) => {
          const paymentProgress = item.principal_amount > 0 ? ((item.amount_paid / item.principal_amount) * 100).toFixed(1) : 0;
          reportContent += `${item.name.padEnd(20)} | ${item.status.padEnd(8)} | Balance: $${item.balance.toFixed(2).padStart(10)}\n`;
          reportContent += `  Principal: $${item.principal_amount.toFixed(2)} | Interest: ${item.interest_rate}% | Paid: $${item.amount_paid.toFixed(2)} (${paymentProgress}%)\n`;
          if (item.due_date) reportContent += `  Due Date: ${item.due_date}\n`;
          reportContent += "\n";
        });
        reportContent += "-".repeat(60) + "\n";
        reportContent += `Total Outstanding Balance: $${stats.totalLoans.toFixed(2)}\n`;
        reportContent += `Total Amount Paid: $${stats.loansPaid.toFixed(2)}\n\n`;
      }
    }

    if (reportType === "summary" || reportType === "hours") {
      reportContent += `WORK HOURS REPORT\n`;
      reportContent += "-".repeat(60) + "\n";
      if (filteredData.hours.length === 0) {
        reportContent += `No work hours recorded for this period.\n\n`;
      } else {
        filteredData.hours.forEach((item) => {
          reportContent += `${item.date}  |  ${item.hours_worked.toString().padStart(5)} hrs`;
          if (item.start_time || item.end_time) {
            reportContent += `  |  ${item.start_time || 'N/A'} - ${item.end_time || 'N/A'}`;
          }
          if (item.notes) reportContent += `  |  ${item.notes}`;
          reportContent += "\n";
        });
        reportContent += "-".repeat(60) + "\n";
        reportContent += `Total Hours: ${stats.totalHours.toFixed(1)} hrs\n`;
        reportContent += `Days Worked: ${filteredData.hours.length}\n`;
        reportContent += `Average per Day: ${(stats.totalHours / filteredData.hours.length).toFixed(1)} hrs\n\n`;
      }
    }

    if (reportType === "summary") {
      reportContent += `FINANCIAL SUMMARY & ANALYSIS\n`;
      reportContent += "=".repeat(60) + "\n\n";
      
      // Income-Expense Relationship
      reportContent += `PROFITABILITY ANALYSIS\n`;
      reportContent += "-".repeat(60) + "\n";
      reportContent += `Total Income:              $${stats.totalIncome.toFixed(2).padStart(12)}\n`;
      reportContent += `Total Expenses:            $${stats.totalExpenses.toFixed(2).padStart(12)}\n`;
      reportContent += `  - Charging Costs:        $${stats.chargingExpenses.toFixed(2).padStart(12)} (${stats.totalIncome > 0 ? ((stats.chargingExpenses / stats.totalIncome) * 100).toFixed(1) : 0}% of income)\n`;
      reportContent += `  - Other Expenses:        $${stats.otherExpenses.toFixed(2).padStart(12)} (${stats.totalIncome > 0 ? ((stats.otherExpenses / stats.totalIncome) * 100).toFixed(1) : 0}% of income)\n`;
      reportContent += "-".repeat(60) + "\n";
      reportContent += `Net Profit (Before Loans): $${stats.netProfit.toFixed(2).padStart(12)} (${stats.totalIncome > 0 ? ((stats.netProfit / stats.totalIncome) * 100).toFixed(1) : 0}% profit margin)\n\n`;

      // Hours-Income Relationship
      reportContent += `PRODUCTIVITY ANALYSIS\n`;
      reportContent += "-".repeat(60) + "\n";
      reportContent += `Total Hours Worked:        ${stats.totalHours.toFixed(1).padStart(12)} hrs\n`;
      reportContent += `Days Worked:               ${filteredData.hours.length.toString().padStart(12)} days\n`;
      reportContent += `Average Hours per Day:     ${filteredData.hours.length > 0 ? (stats.totalHours / filteredData.hours.length).toFixed(1) : '0.0'} hrs\n`;
      reportContent += `Hourly Rate:               $${stats.hourlyRate.toFixed(2).padStart(11)}/hr\n`;
      reportContent += `Average Income per Day:    $${filteredData.income.length > 0 ? (stats.totalIncome / filteredData.income.length).toFixed(2) : '0.00'}\n\n`;

      // Expense-Income Ratio
      reportContent += `EFFICIENCY METRICS\n`;
      reportContent += "-".repeat(60) + "\n";
      const expenseRatio = stats.totalIncome > 0 ? ((stats.totalExpenses / stats.totalIncome) * 100).toFixed(1) : 0;
      const chargingPerHour = stats.totalHours > 0 ? (stats.chargingExpenses / stats.totalHours).toFixed(2) : '0.00';
      reportContent += `Expense Ratio:             ${expenseRatio}% (you keep ${(100 - Number(expenseRatio)).toFixed(1)}% of gross income)\n`;
      reportContent += `Charging Cost per Hour:    $${chargingPerHour}\n`;
      reportContent += `Net Earnings per Hour:     $${stats.totalHours > 0 ? (stats.netProfit / stats.totalHours).toFixed(2) : '0.00'}\n\n`;

      // Loan Impact
      if (stats.totalLoans > 0 || stats.loansPaid > 0) {
        reportContent += `LOAN OBLIGATIONS\n`;
        reportContent += "-".repeat(60) + "\n";
        reportContent += `Outstanding Loan Balance:  $${stats.totalLoans.toFixed(2).padStart(12)}\n`;
        reportContent += `Total Paid to Loans:       $${stats.loansPaid.toFixed(2).padStart(12)}\n`;
        const profitAfterLoans = stats.netProfit - stats.loansPaid;
        reportContent += `Net Profit After Loans:    $${profitAfterLoans.toFixed(2).padStart(12)}\n`;
        if (stats.totalLoans > 0 && stats.netProfit > 0) {
          const monthsToPayoff = stats.totalLoans / stats.netProfit;
          reportContent += `Months to Payoff (at current rate): ${monthsToPayoff.toFixed(1)} months\n`;
        }
        reportContent += "\n";
      }

      // Key Insights
      reportContent += `KEY INSIGHTS\n`;
      reportContent += "-".repeat(60) + "\n";
      if (stats.netProfit > 0) {
        reportContent += `✓ You are operating at a profit of $${stats.netProfit.toFixed(2)}\n`;
      } else {
        reportContent += `✗ You are operating at a loss of $${Math.abs(stats.netProfit).toFixed(2)}\n`;
      }
      
      if (stats.totalHours > 0) {
        if (stats.hourlyRate >= 20) {
          reportContent += `✓ Your hourly rate of $${stats.hourlyRate.toFixed(2)}/hr is good\n`;
        } else {
          reportContent += `! Your hourly rate of $${stats.hourlyRate.toFixed(2)}/hr could be improved\n`;
        }
      }
      
      if (Number(expenseRatio) > 50) {
        reportContent += `! Your expenses are ${expenseRatio}% of income - consider reducing costs\n`;
      } else {
        reportContent += `✓ Your expenses are ${expenseRatio}% of income - well controlled\n`;
      }
      
      if (stats.totalLoans > stats.netProfit * 3) {
        reportContent += `! High loan burden - focus on increasing income or reducing expenses\n`;
      }
      
      reportContent += "\n";
    }

    return reportContent;
  };

  const getReportFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const reportTypeName = reportType.charAt(0).toUpperCase() + reportType.slice(1);
    return `UberTracker_${reportTypeName}_${startDate}_to_${endDate}_Generated_${timestamp}`;
  };

  const downloadReport = () => {
    const content = generateReport();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getReportFileName()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    let csvContent = "";
    
    if (reportType === "summary" || reportType === "income") {
      csvContent += "INCOME DATA\n";
      csvContent += "Date,Amount,Notes\n";
      filteredData.income.forEach((item) => {
        csvContent += `${item.date},${item.amount.toFixed(2)},"${item.notes || ""}"\n`;
      });
      csvContent += "\n";
    }
    
    if (reportType === "summary" || reportType === "expenses") {
      csvContent += "EXPENSES DATA\n";
      csvContent += "Date,Type,Amount,Notes\n";
      filteredData.expenses.forEach((item) => {
        csvContent += `${item.date},${item.type},${item.amount.toFixed(2)},"${item.notes || ""}"\n`;
      });
      csvContent += "\n";
    }
    
    if (reportType === "summary" || reportType === "hours") {
      csvContent += "WORK HOURS DATA\n";
      csvContent += "Date,Hours Worked,Start Time,End Time,Notes\n";
      filteredData.hours.forEach((item) => {
        csvContent += `${item.date},${item.hours_worked},${item.start_time || ""},${item.end_time || ""},"${item.notes || ""}"\n`;
      });
      csvContent += "\n";
    }
    
    if (reportType === "summary" || reportType === "loans") {
      csvContent += "LOANS DATA\n";
      csvContent += "Name,Status,Principal,Interest Rate,Amount Paid,Balance,Due Date\n";
      filteredData.loans.forEach((item) => {
        csvContent += `"${item.name}",${item.status},${item.principal_amount.toFixed(2)},${item.interest_rate},${item.amount_paid.toFixed(2)},${item.balance.toFixed(2)},${item.due_date || ""}\n`;
      });
      csvContent += "\n";
    }
    
    csvContent += "SUMMARY STATISTICS\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Income,${stats.totalIncome.toFixed(2)}\n`;
    csvContent += `Total Expenses,${stats.totalExpenses.toFixed(2)}\n`;
    csvContent += `Charging Expenses,${stats.chargingExpenses.toFixed(2)}\n`;
    csvContent += `Other Expenses,${stats.otherExpenses.toFixed(2)}\n`;
    csvContent += `Net Profit,${stats.netProfit.toFixed(2)}\n`;
    csvContent += `Total Hours,${stats.totalHours.toFixed(1)}\n`;
    csvContent += `Hourly Rate,${stats.hourlyRate.toFixed(2)}\n`;
    csvContent += `Outstanding Loans,${stats.totalLoans.toFixed(2)}\n`;
    csvContent += `Total Loan Payments,${stats.loansPaid.toFixed(2)}\n`;
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getReportFileName()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const content = generateReport();
    const fileName = getReportFileName();
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${fileName}</title>
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 11pt;
              line-height: 1.4;
              color: #000;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              margin: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #000;
              text-align: center;
              font-size: 9pt;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>UBER TRACKER FINANCIAL REPORT</h2>
            <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
            <p><strong>File Name:</strong> ${fileName}</p>
          </div>
          <pre>${content}</pre>
          <div class="footer">
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>Uber Tracker - Financial Management System</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load before printing
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate detailed reports for your Uber finances
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardTitle className="mb-4">Report Settings</CardTitle>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <option value="summary">Summary (All)</option>
                <option value="income">Income Only</option>
                <option value="expenses">Expenses Only</option>
                <option value="loans">Loans Only</option>
                <option value="hours">Hours Only</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="pt-2 space-y-2">
              <Button onClick={downloadReport} className="w-full">
                📄 Download Text Report
              </Button>
              <Button onClick={downloadCSV} variant="secondary" className="w-full">
                📊 Download CSV (Excel)
              </Button>
              <Button onClick={printReport} variant="secondary" className="w-full">
                🖨️ Print Report
              </Button>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <CardTitle className="mb-4">Report Preview</CardTitle>
          
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Income</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${stats.totalIncome.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Expenses</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    ${stats.totalExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Net Profit</p>
                  <p className={`text-xl font-bold ${stats.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${stats.netProfit.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Hours</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalHours.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Detailed breakdown */}
              <div className="max-h-[500px] overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
                <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-mono">
                  {generateReport()}
                </pre>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
