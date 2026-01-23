"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mileage } from "@/lib/types";
import { getLocalDateString } from "@/lib/utils";

const MILEAGE_RATE = 0.67;

export default function MileagePage() {
  const [mileage, setMileage] = useState<Mileage[]>([]);
  const [totalMiles, setTotalMiles] = useState(0);
  const [deduction, setDeduction] = useState(0);
  const [latestOdometer, setLatestOdometer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: getLocalDateString(),
    odometer: "",
    notes: "",
  });

  useEffect(() => {
    fetchMileage();
  }, []);

  const fetchMileage = async () => {
    try {
      const response = await fetch("/api/mileage");
      const data = await response.json();
      setMileage(data.entries || []);
      setTotalMiles(data.totalMiles || 0);
      setDeduction(data.deduction || 0);
      setLatestOdometer(data.latestOdometer || 0);
    } catch (error) {
      console.error("Failed to fetch mileage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/mileage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          odometer: parseFloat(formData.odometer),
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        setFormData({
          date: getLocalDateString(),
          odometer: "",
          notes: "",
        });
        fetchMileage();
      }
    } catch (error) {
      console.error("Failed to add mileage:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this mileage entry? Miles will be recalculated.")) return;
    try {
      await fetch(`/api/mileage?id=${id}`, { method: "DELETE" });
      fetchMileage();
    } catch (error) {
      console.error("Failed to delete mileage:", error);
    }
  };

  // Calculate estimated miles for preview
  const estimatedMiles = formData.odometer && latestOdometer > 0
    ? Math.max(0, parseFloat(formData.odometer) - latestOdometer)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page Header */}
      <div className="bg-slate-700 dark:bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold">Mileage Tracking</h1>
          <p className="text-slate-300 mt-1">Record odometer readings for IRS standard mileage deduction</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tax Deduction Summary */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="bg-blue-600 px-6 py-3">
            <h2 className="font-bold text-white">IRS Mileage Deduction Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Deduction</p>
                <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">
                  ${deduction.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Miles</p>
                <p className="text-4xl font-bold text-slate-800 dark:text-white">
                  {totalMiles.toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">IRS Rate (2024)</p>
                <p className="text-4xl font-bold text-slate-800 dark:text-white">
                  ${MILEAGE_RATE}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">per mile</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Mileage Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600">
                <h2 className="font-bold text-slate-800 dark:text-white">Log Odometer Reading</h2>
              </div>
              <div className="p-6">
                {/* Current odometer display */}
                {latestOdometer > 0 && (
                  <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Previous Reading</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">
                      {latestOdometer.toLocaleString()} mi
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label htmlFor="odometer" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Current Odometer <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="odometer"
                      type="number"
                      step="1"
                      placeholder={latestOdometer > 0 ? `e.g., ${(latestOdometer + 50).toLocaleString()}` : "Enter odometer reading"}
                      value={formData.odometer}
                      onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.odometer && latestOdometer > 0 && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Miles:</strong> {estimatedMiles.toFixed(0)}
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Deduction:</strong> ${(estimatedMiles * MILEAGE_RATE).toFixed(2)}
                        </p>
                      </div>
                    )}
                    {formData.odometer && latestOdometer === 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        First entry establishes starting odometer
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      id="notes"
                      type="text"
                      placeholder="Trip purpose or notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                    Submit Reading
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Mileage History */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="bg-slate-100 dark:bg-slate-700 px-6 py-3 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 dark:text-white">Mileage Log</h2>
                <div className="text-right">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total Recorded</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{totalMiles.toFixed(0)} mi</p>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <p className="text-slate-600 dark:text-slate-400">Loading mileage records...</p>
                ) : mileage.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-600">
                    <p className="text-slate-600 dark:text-slate-400 mb-2">No mileage records</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Enter your current odometer reading to begin tracking
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-2 text-sm font-medium text-slate-600 dark:text-slate-400">Date</th>
                          <th className="text-left py-2 text-sm font-medium text-slate-600 dark:text-slate-400">Odometer</th>
                          <th className="text-left py-2 text-sm font-medium text-slate-600 dark:text-slate-400">Miles</th>
                          <th className="text-left py-2 text-sm font-medium text-slate-600 dark:text-slate-400">Deduction</th>
                          <th className="text-left py-2 text-sm font-medium text-slate-600 dark:text-slate-400">Notes</th>
                          <th className="text-right py-2 text-sm font-medium text-slate-600 dark:text-slate-400">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {mileage.map((entry) => (
                          <tr key={entry.id}>
                            <td className="py-3 text-sm text-slate-800 dark:text-white">{entry.date}</td>
                            <td className="py-3 text-sm text-slate-800 dark:text-white">{entry.odometer.toLocaleString()}</td>
                            <td className="py-3 text-sm text-slate-800 dark:text-white">
                              {entry.miles > 0 ? `+${entry.miles.toFixed(0)}` : "—"}
                            </td>
                            <td className="py-3 text-sm text-blue-700 dark:text-blue-400 font-medium">
                              {entry.miles > 0 ? `$${(entry.miles * MILEAGE_RATE).toFixed(2)}` : "—"}
                            </td>
                            <td className="py-3 text-sm text-slate-500 dark:text-slate-400">
                              {entry.notes || "—"}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>How it works:</strong> Enter your odometer reading after each driving session. 
            Miles are automatically calculated from the difference between readings. 
            The IRS standard mileage rate for 2024 is $0.67 per mile for business use.
          </p>
        </div>
      </div>
    </div>
  );
}
