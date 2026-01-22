"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Loan } from "@/lib/types";

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
      }
    } catch (error) {
      console.error("Failed to record payment:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this loan?")) return;
    try {
      await fetch(`/api/loans?id=${id}`, { method: "DELETE" });
      fetchLoans();
    } catch (error) {
      console.error("Failed to delete loan:", error);
    }
  };

  const activeLoans = loans.filter((l) => l.status === "active");
  const totalBalance = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
  const totalPaid = loans.reduce((sum, loan) => sum + loan.amount_paid, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Loan Management</h1>
        <p className="text-gray-400">Track your loans and payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardTitle className="mb-4">Add New Loan</CardTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Loan Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Car Loan"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="principal_amount">Principal Amount ($)</Label>
              <Input
                id="principal_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.principal_amount}
                onChange={(e) =>
                  setFormData({ ...formData, principal_amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="interest_rate">Interest Rate (%)</Label>
              <Input
                id="interest_rate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.interest_rate}
                onChange={(e) =>
                  setFormData({ ...formData, interest_rate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date (Optional)</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Add Loan
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Your Loans</CardTitle>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-orange-400">
                ${totalBalance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total Paid: ${totalPaid.toFixed(2)}
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : loans.length === 0 ? (
            <p className="text-gray-400">No loans yet. Add your first loan!</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-lg">
                          {loan.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            loan.status === "paid"
                              ? "bg-green-900 text-green-200"
                              : "bg-orange-900 text-orange-200"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Principal: ${loan.principal_amount.toFixed(2)} | Rate:{" "}
                        {loan.interest_rate}%
                      </p>
                      {loan.due_date && (
                        <p className="text-sm text-gray-500">
                          Due: {loan.due_date}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(loan.id)}
                      className="text-sm px-3 py-2"
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Balance</p>
                      <p className="text-lg font-bold text-orange-400">
                        ${loan.balance.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Paid</p>
                      <p className="text-lg font-bold text-green-400">
                        ${loan.amount_paid.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {loan.status === "active" && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Payment amount"
                        value={paymentData[loan.id] || ""}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            [loan.id]: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handlePayment(loan.id)}
                        className="whitespace-nowrap"
                      >
                        Make Payment
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
