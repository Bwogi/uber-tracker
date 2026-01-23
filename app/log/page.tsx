"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getLocalDateString } from "@/lib/utils";

const MILEAGE_RATE = 0.67;

interface Expense {
  type: string;
  amount: string;
}

export default function LogEntryPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [latestOdometer, setLatestOdometer] = useState(0);
  const [formData, setFormData] = useState({
    date: getLocalDateString(),
    income: "",
    odometer: "",
    hours_worked: "",
    start_time: "",
    end_time: "",
    notes: "",
  });
  const [expenses, setExpenses] = useState<Expense[]>([{ type: "charging", amount: "" }]);

  const addExpense = () => {
    setExpenses([...expenses, { type: "charging", amount: "" }]);
  };

  const removeExpense = (index: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    }
  };

  const updateExpense = (index: number, field: keyof Expense, value: string) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], [field]: value };
    setExpenses(updated);
  };

  useEffect(() => {
    fetchLatestOdometer();
  }, []);

  const fetchLatestOdometer = async () => {
    try {
      const response = await fetch("/api/mileage");
      const data = await response.json();
      setLatestOdometer(data.latestOdometer || 0);
    } catch (error) {
      console.error("Failed to fetch odometer:", error);
    }
  };

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const totalMinutes = endMinutes - startMinutes;
    return Math.max(0, Math.round((totalMinutes / 60) * 100) / 100);
  };

  const handleTimeChange = (field: 'start_time' | 'end_time', value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (newFormData.start_time && newFormData.end_time) {
      const calculatedHours = calculateHours(newFormData.start_time, newFormData.end_time);
      setFormData(prev => ({ ...prev, [field]: value, hours_worked: calculatedHours.toString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const promises = [];

      // Submit income if provided
      if (formData.income && parseFloat(formData.income) > 0) {
        promises.push(
          fetch("/api/income", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: formData.date,
              amount: parseFloat(formData.income),
              notes: formData.notes,
            }),
          })
        );
      }

      // Submit odometer if provided
      if (formData.odometer && parseFloat(formData.odometer) > 0) {
        promises.push(
          fetch("/api/mileage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: formData.date,
              odometer: parseFloat(formData.odometer),
              notes: formData.notes,
            }),
          })
        );
      }

      // Submit hours if provided
      if (formData.hours_worked && parseFloat(formData.hours_worked) > 0) {
        promises.push(
          fetch("/api/hours", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: formData.date,
              hours_worked: parseFloat(formData.hours_worked),
              start_time: formData.start_time || null,
              end_time: formData.end_time || null,
              notes: formData.notes,
            }),
          })
        );
      }

      // Submit expenses if provided
      expenses.forEach((expense) => {
        if (expense.amount && parseFloat(expense.amount) > 0) {
          promises.push(
            fetch("/api/expenses", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                date: formData.date,
                type: expense.type,
                amount: parseFloat(expense.amount),
                notes: formData.notes,
              }),
            })
          );
        }
      });

      if (promises.length === 0) {
        alert("Please enter at least one value to log");
        setLoading(false);
        return;
      }

      await Promise.all(promises);
      
      setSuccess(true);
      setFormData({
        date: getLocalDateString(),
        income: "",
        odometer: "",
        hours_worked: "",
        start_time: "",
        end_time: "",
        notes: "",
      });
      setExpenses([{ type: "charging", amount: "" }]);
      
      // Refresh latest odometer after save
      fetchLatestOdometer();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to log entry:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page Header */}
      <div className="bg-slate-700 dark:bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold">Daily Activity Log</h1>
          <p className="text-slate-300 mt-1">Record your driving session income, mileage, hours, and expenses</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 border-l-4 border-green-600 bg-green-50 dark:bg-green-950 p-4">
            <p className="text-green-800 dark:text-green-200 font-medium">Entry saved successfully</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">Your data has been recorded.</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Instructions:</strong> Complete the fields below to log your driving activity. 
            Only fill in the sections that apply—leave others blank. All fields are optional except date.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
              <h2 className="font-bold text-slate-800 dark:text-white">Section 1: Date & Income</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="income" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Gross Income ($)
                  </label>
                  <input
                    id="income"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total earnings before expenses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Mileage */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
              <h2 className="font-bold text-slate-800 dark:text-white">Section 2: Mileage Tracking</h2>
            </div>
            <div className="p-6">
              <div>
                <label htmlFor="odometer" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current Odometer Reading
                  {latestOdometer > 0 && (
                    <span className="font-normal text-slate-500 dark:text-slate-400 ml-2">
                      (Previous: {latestOdometer.toLocaleString()} mi)
                    </span>
                  )}
                </label>
                <input
                  id="odometer"
                  type="number"
                  step="1"
                  placeholder={latestOdometer > 0 ? `e.g., ${(latestOdometer + 50).toLocaleString()}` : "Enter current odometer reading"}
                  value={formData.odometer}
                  onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.odometer && latestOdometer > 0 && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Calculated Miles:</strong> {Math.max(0, parseFloat(formData.odometer) - latestOdometer).toFixed(0)} miles
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>IRS Deduction:</strong> ${(Math.max(0, parseFloat(formData.odometer) - latestOdometer) * MILEAGE_RATE).toFixed(2)} (at $0.67/mile)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Hours Worked */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
              <h2 className="font-bold text-slate-800 dark:text-white">Section 3: Hours Worked</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleTimeChange('start_time', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleTimeChange('end_time', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="hours_worked" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total Hours Worked
                </label>
                <input
                  id="hours_worked"
                  type="number"
                  step="0.01"
                  placeholder="Auto-calculated from times or enter manually"
                  value={formData.hours_worked}
                  onChange={(e) => setFormData({ ...formData, hours_worked: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hours are auto-calculated if start and end times are provided</p>
              </div>
            </div>
          </div>

          {/* Section 4: Expenses */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 dark:text-white">Section 4: Business Expenses</h2>
              <button
                type="button"
                onClick={addExpense}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                + Add Another Expense
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {expenses.map((expense, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      {index === 0 && (
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Expense Type
                        </label>
                      )}
                      <select
                        value={expense.type}
                        onChange={(e) => updateExpense(index, "type", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="charging">Charging/Gas</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="phone">Phone</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-span-5">
                      {index === 0 && (
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Amount ($)
                        </label>
                      )}
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={expense.amount}
                        onChange={(e) => updateExpense(index, "amount", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2 flex justify-center">
                      {expenses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExpense(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Notes */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
              <h2 className="font-bold text-slate-800 dark:text-white">Section 5: Additional Notes</h2>
            </div>
            <div className="p-6">
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Any additional notes for this entry..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3" disabled={loading}>
              {loading ? "Submitting..." : "Submit Entry"}
            </Button>
            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-3">
              Only completed fields will be recorded. Empty fields are ignored.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
