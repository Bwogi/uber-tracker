import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Income } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const income = db.prepare('SELECT * FROM income ORDER BY date DESC').all() as Income[];
    return NextResponse.json(income);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch income' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, amount, notes } = body;

    if (!date || !amount) {
      return NextResponse.json({ error: 'Date and amount are required' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO income (date, amount, notes) VALUES (?, ?, ?)');
    const result = stmt.run(date, amount, notes || null);

    return NextResponse.json({ id: result.lastInsertRowid, date, amount, notes }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create income entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const stmt = db.prepare('DELETE FROM income WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ message: 'Income entry deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete income entry' }, { status: 500 });
  }
}
