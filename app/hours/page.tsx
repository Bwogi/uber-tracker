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
        <p className="text-gray-400">Track your daily working hours</p>
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
              <Label htmlFor="hours_worked">Hours Worked</Label>
              <Input
                id="hours_worked"
                type="number"
                step="0.5"
                placeholder="8.0"
                value={formData.hours_worked}
                onChange={(e) =>
                  setFormData({ ...formData, hours_worked: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="start_time">Start Time (Optional)</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time (Optional)</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
              />
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
              <p className="text-sm text-gray-400">Total Hours</p>
              <p className="text-2xl font-bold text-blue-400">
                {totalHours.toFixed(1)} hrs
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : hours.length === 0 ? (
            <p className="text-gray-400">No hours logged yet. Add your first entry!</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {hours.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {entry.hours_worked} hours
                    </p>
                    <p className="text-sm text-gray-400">{entry.date}</p>
                    {(entry.start_time || entry.end_time) && (
                      <p className="text-sm text-gray-500">
                        {entry.start_time && `Start: ${entry.start_time}`}
                        {entry.start_time && entry.end_time && " | "}
                        {entry.end_time && `End: ${entry.end_time}`}
                      </p>
                    )}
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
