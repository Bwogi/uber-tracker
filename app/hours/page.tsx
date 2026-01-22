"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { WorkHours } from "@/lib/types";

export default function HoursPage() {
  const [hours, setHours] = useState<WorkHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    hours_worked: "",
    start_time: "",
    end_time: "",
    notes: "",
  });
  const [spansNextDay, setSpansNextDay] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      const response = await fetch("/api/hours");
      const data = await response.json();
      setHours(data);
    } catch (error) {
      console.error("Failed to fetch hours:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = (start: string, end: string, nextDay: boolean) => {
    if (!start || !end) return 0;
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // If work spans to next day, add 24 hours to end time
    if (nextDay) {
      endMinutes += 24 * 60;
    }
    // If end time is earlier than start time and not marked as next day, assume next day
    else if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
      setSpansNextDay(true);
    }
    
    const totalMinutes = endMinutes - startMinutes;
    const hours = totalMinutes / 60;
    
    return Math.max(0, Math.round(hours * 100) / 100); // Round to 2 decimal places
  };

  const handleTimeChange = (field: 'start_time' | 'end_time', value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Auto-calculate hours if both times are set
    if (newFormData.start_time && newFormData.end_time) {
      const calculatedHours = calculateHours(
        newFormData.start_time,
        newFormData.end_time,
        spansNextDay
      );
      setFormData(prev => ({ ...prev, hours_worked: calculatedHours.toString() }));
    }
  };

  const handleSpansNextDayChange = (checked: boolean) => {
    setSpansNextDay(checked);
    if (formData.start_time && formData.end_time) {
      const calculatedHours = calculateHours(
        formData.start_time,
        formData.end_time,
        checked
      );
      setFormData(prev => ({ ...prev, hours_worked: calculatedHours.toString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          hours_worked: "",
          start_time: "",
          end_time: "",
          notes: "",
        });
        setSpansNextDay(false);
        fetchHours();
      }
    } catch (error) {
      console.error("Failed to add hours:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`/api/hours?id=${id}`, { method: "DELETE" });
      fetchHours();
    } catch (error) {
      console.error("Failed to delete hours:", error);
    }
  };

  const totalHours = hours.reduce((sum, entry) => sum + entry.hours_worked, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Work Hours Tracking</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your daily working hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardTitle className="mb-4">Log Hours</CardTitle>
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
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleTimeChange('start_time', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleTimeChange('end_time', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={spansNextDay}
                  onChange={(e) => handleSpansNextDayChange(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                />
                <span className="text-gray-700 dark:text-gray-300">Work continues into next day</span>
              </label>
            </div>
            <div>
              <Label htmlFor="hours_worked">Hours Worked (Auto-calculated)</Label>
              <Input
                id="hours_worked"
                type="number"
                step="0.01"
                placeholder="Calculated from times"
                value={formData.hours_worked}
                onChange={(e) =>
                  setFormData({ ...formData, hours_worked: e.target.value })
                }
                required
                className="bg-gray-200 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.hours_worked && `${formData.hours_worked} hours = ${(parseFloat(formData.hours_worked) * 60).toFixed(0)} minutes`}
              </p>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                type="text"
                placeholder="Break times, busy periods, etc."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Log Hours
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Hours History</CardTitle>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalHours.toFixed(1)} hrs
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : hours.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No hours logged yet. Add your first entry!</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {hours.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {entry.hours_worked} hours
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</p>
                    {(entry.start_time || entry.end_time) && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {entry.start_time && `Start: ${entry.start_time}`}
                        {entry.start_time && entry.end_time && " | "}
                        {entry.end_time && `End: ${entry.end_time}`}
                      </p>
                    )}
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
