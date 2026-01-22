import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Expense } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const expenses = db.prepare('SELECT * FROM expenses ORDER BY date DESC').all() as Expense[];
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, type, amount, notes } = body;

    if (!date || !type || !amount) {
      return NextResponse.json({ error: 'Date, type, and amount are required' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO expenses (date, type, amount, notes) VALUES (?, ?, ?, ?)');
    const result = stmt.run(date, type, amount, notes || null);

    return NextResponse.json({ id: result.lastInsertRowid, date, type, amount, notes }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ message: 'Expense entry deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense entry' }, { status: 500 });
  }
}
