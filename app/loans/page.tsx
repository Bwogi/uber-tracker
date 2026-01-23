"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loan, LoanPayment } from "@/lib/types";

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    principal_amount: "",
    interest_rate: "",
    due_date: "",
  });
  const [paymentData, setPaymentData] = useState<{ [key: number]: string }>({});
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);
  const [payments, setPayments] = useState<{ [key: number]: LoanPayment[] }>({});

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch("/api/loans");
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          principal_amount: "",
          interest_rate: "",
          due_date: "",
        });
        fetchLoans();
      }
    } catch (error) {
      console.error("Failed to add loan:", error);
    }
  };

  const handlePayment = async (loanId: number) => {
    const amount = parseFloat(paymentData[loanId] || "0");
    if (amount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    try {
      const response = await fetch("/api/loans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loanId, payment_amount: amount }),
      });

      if (response.ok) {
        setPaymentData({ ...paymentData, [loanId]: "" });
        fetchLoans();
        if (expandedLoan === loanId) {
          fetchPayments(loanId);
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to record payment");
      }
    } catch (error) {
      console.error("Failed to record payment:", error);
      alert("Failed to record payment. Please try again.");
    }
  };

  const handleRecalculate = async (loanId: number) => {
    try {
      const response = await fetch("/api/loans/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loanId }),
      });

      if (response.ok) {
        fetchLoans();
        alert("Loan balance recalculated from payment history");
      }
    } catch (error) {
      console.error("Failed to recalculate:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this loan and all associated payments?")) return;
    try {
      const response = await fetch(`/api/loans?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        // Clear expanded state if this loan was expanded
        if (expandedLoan === id) {
          setExpandedLoan(null);
        }
        // Remove from payments cache
        setPayments((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        fetchLoans();
      } else {
        alert("Failed to delete loan");
      }
    } catch (error) {
      console.error("Failed to delete loan:", error);
      alert("Failed to delete loan");
    }
  };

  const fetchPayments = async (loanId: number) => {
    try {
      const response = await fetch(`/api/loans?loan_id=${loanId}`);
      const data = await response.json();
      setPayments((prev) => ({ ...prev, [loanId]: data }));
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  const togglePaymentHistory = (loanId: number) => {
    if (expandedLoan === loanId) {
      setExpandedLoan(null);
    } else {
      setExpandedLoan(loanId);
      fetchPayments(loanId);
    }
  };

  const handleDeletePayment = async (paymentId: number, loanId: number) => {
    if (!confirm("Delete this payment? The loan balance will be recalculated.")) return;
    try {
      const response = await fetch(`/api/loans?payment_id=${paymentId}`, { method: "DELETE" });
      if (response.ok) {
        fetchLoans();
        fetchPayments(loanId);
      }
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const activeLoans = loans.filter((l) => l.status === "active");
  const totalBalance = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
  const totalPaid = loans.reduce((sum, loan) => sum + loan.amount_paid, 0);
  const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principal_amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page Header */}
      <div className="bg-slate-700 dark:bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold">Loan Management</h1>
          <p className="text-slate-300 mt-1">Track vehicle loans and payment progress</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Loan Summary */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="bg-amber-600 px-6 py-3">
            <h2 className="font-bold text-white">Loan Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Outstanding Balance</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                  ${totalBalance.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Paid</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                  ${totalPaid.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Principal</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">
                  ${totalPrincipal.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Active Loans</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">
                  {activeLoans.length}
                </p>
              </div>
            </div>
            {totalPrincipal > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Overall Payoff Progress</span>
                  <span>{((totalPaid / totalPrincipal) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${Math.min(100, (totalPaid / totalPrincipal) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Loan Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
                <h2 className="font-bold text-slate-800 dark:text-white">Add New Loan</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Loan Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g., Vehicle Loan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="principal_amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Principal Amount ($) <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="principal_amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.principal_amount}
                      onChange={(e) => setFormData({ ...formData, principal_amount: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="interest_rate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Interest Rate (%)
                    </label>
                    <input
                      id="interest_rate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.interest_rate}
                      onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Due Date (Optional)
                    </label>
                    <input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                    Add Loan
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Loan List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 dark:text-white">Loan Records</h2>
                <div className="text-right">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total Balance</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">${totalBalance.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <p className="text-slate-600 dark:text-slate-400">Loading loan records...</p>
                ) : loans.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-600">
                    <p className="text-slate-600 dark:text-slate-400 mb-2">No loan records</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Add your first loan to begin tracking
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.map((loan) => (
                      <div
                        key={loan.id}
                        className="border border-slate-200 dark:border-slate-700"
                      >
                        {/* Loan Header */}
                        <div className="bg-slate-50 dark:bg-slate-700 px-4 py-3 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-800 dark:text-white">
                                {loan.name}
                              </h3>
                              <span className={`text-xs px-2 py-0.5 font-medium ${
                                loan.status === "paid"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                              }`}>
                                {loan.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Principal: ${loan.principal_amount.toFixed(2)} | Rate: {loan.interest_rate}%
                              {loan.due_date && ` | Due: ${loan.due_date}`}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            {loan.balance < 0 && (
                              <button
                                onClick={() => handleRecalculate(loan.id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                              >
                                Fix Data
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(loan.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Loan Details */}
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">Remaining Balance</p>
                              <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                                ${loan.balance.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">Amount Paid</p>
                              <p className="text-xl font-bold text-green-700 dark:text-green-400">
                                ${loan.amount_paid.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                              <span>Payoff Progress</span>
                              <span>{((loan.amount_paid / loan.principal_amount) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-600 overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all"
                                style={{ width: `${Math.min(100, (loan.amount_paid / loan.principal_amount) * 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Payment Form */}
                          {loan.status === "active" && (
                            <div className="flex gap-2 mb-3">
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Payment amount"
                                value={paymentData[loan.id] || ""}
                                onChange={(e) => setPaymentData({ ...paymentData, [loan.id]: e.target.value })}
                                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handlePayment(loan.id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 font-semibold"
                              >
                                Record Payment
                              </button>
                            </div>
                          )}

                          {/* Payment History */}
                          <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
                            <button
                              type="button"
                              onClick={() => togglePaymentHistory(loan.id)}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                              {expandedLoan === loan.id ? "Hide Payment History" : "View Payment History"}
                            </button>

                            {expandedLoan === loan.id && (
                              <div className="mt-3">
                                {!payments[loan.id] || payments[loan.id].length === 0 ? (
                                  <p className="text-sm text-slate-500 dark:text-slate-400 py-2">No payments recorded.</p>
                                ) : (
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-slate-200 dark:border-slate-600">
                                        <th className="text-left py-2 text-xs font-medium text-slate-600 dark:text-slate-400">Date</th>
                                        <th className="text-left py-2 text-xs font-medium text-slate-600 dark:text-slate-400">Amount</th>
                                        <th className="text-right py-2 text-xs font-medium text-slate-600 dark:text-slate-400">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                                      {payments[loan.id].map((payment) => (
                                        <tr key={payment.id}>
                                          <td className="py-2 text-slate-800 dark:text-white">{payment.payment_date}</td>
                                          <td className="py-2 text-green-700 dark:text-green-400 font-medium">${payment.amount.toFixed(2)}</td>
                                          <td className="py-2 text-right">
                                            <button
                                              type="button"
                                              onClick={() => handleDeletePayment(payment.id, loan.id)}
                                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium"
                                            >
                                              Remove
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Note:</strong> Track your vehicle loans to understand how debt payments affect your net earnings. 
            Loan payments are factored into your dashboard's net profit calculation. 
            You can remove incorrect payments and the balance will automatically recalculate.
          </p>
        </div>
      </div>
    </div>
  );
}
