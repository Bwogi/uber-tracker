"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Income } from "@/lib/types";

export default function IncomePage() {
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    notes: "",
  });

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const response = await fetch("/api/income");
      const data = await response.json();
      setIncome(data);
    } catch (error) {
      console.error("Failed to fetch income:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          notes: "",
        });
        fetchIncome();
      }
    } catch (error) {
      console.error("Failed to add income:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`/api/income?id=${id}`, { method: "DELETE" });
      fetchIncome();
    } catch (error) {
      console.error("Failed to delete income:", error);
    }
  };

  const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Income Tracking</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your daily Uber earnings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardTitle className="mb-4">Add Income</CardTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                type="text"
                placeholder="Trip details, bonuses, etc."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Add Income
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Income History</CardTitle>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : income.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No income entries yet. Add your first entry!</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {income.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${entry.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</p>
                    {entry.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{entry.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(entry.id)}
                    className="ml-4"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
