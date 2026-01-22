"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "charging" as "charging" | "other",
    amount: "",
    notes: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          type: "charging",
          amount: "",
          notes: "",
        });
        fetchExpenses();
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const totalExpenses = expenses.reduce((sum, entry) => sum + entry.amount, 0);
  const chargingExpenses = expenses
    .filter((e) => e.type === "charging")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const otherExpenses = expenses
    .filter((e) => e.type === "other")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Expense Tracking</h1>
        <p className="text-gray-400">Track charging and other expenses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardTitle className="mb-4">Add Expense</CardTitle>
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
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "charging" | "other",
                  })
                }
                required
              >
                <option value="charging">Charging</option>
                <option value="other">Other</option>
              </Select>
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
                placeholder="Details about the expense"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Add Expense
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Expense History</CardTitle>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">
                ${totalExpenses.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Charging: ${chargingExpenses.toFixed(2)} | Other: $
                {otherExpenses.toFixed(2)}
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-gray-400">No expense entries yet. Add your first entry!</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {expenses.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">
                        ${entry.amount.toFixed(2)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          entry.type === "charging"
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-blue-900 text-blue-200"
                        }`}
                      >
                        {entry.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{entry.date}</p>
                    {entry.notes && (
                      <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>
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
