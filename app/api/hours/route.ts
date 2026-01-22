import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { WorkHours } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hours = db.prepare('SELECT * FROM work_hours ORDER BY date DESC').all() as WorkHours[];
    return NextResponse.json(hours);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch work hours' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, hours_worked, start_time, end_time, notes } = body;

    if (!date || !hours_worked) {
      return NextResponse.json({ error: 'Date and hours worked are required' }, { status: 400 });
    }

    const stmt = db.prepare(
      'INSERT INTO work_hours (date, hours_worked, start_time, end_time, notes) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(date, hours_worked, start_time || null, end_time || null, notes || null);

    return NextResponse.json(
      { id: result.lastInsertRowid, date, hours_worked, start_time, end_time, notes },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create work hours entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const stmt = db.prepare('DELETE FROM work_hours WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ message: 'Work hours entry deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete work hours entry' }, { status: 500 });
  }
}
