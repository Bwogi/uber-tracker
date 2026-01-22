import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Loan } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const loans = db.prepare('SELECT * FROM loans ORDER BY created_at DESC').all() as Loan[];
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, principal_amount, interest_rate, due_date } = body;

    if (!name || !principal_amount) {
      return NextResponse.json({ error: 'Name and principal amount are required' }, { status: 400 });
    }

    const balance = principal_amount;
    const stmt = db.prepare(
      'INSERT INTO loans (name, principal_amount, interest_rate, balance, due_date) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, principal_amount, interest_rate || 0, balance, due_date || null);

    return NextResponse.json(
      { id: result.lastInsertRowid, name, principal_amount, interest_rate, balance, due_date },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create loan' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, payment_amount } = body;

    if (!id || !payment_amount) {
      return NextResponse.json({ error: 'ID and payment amount are required' }, { status: 400 });
    }

    // Get current loan
    const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id) as Loan;
    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    // Update loan
    const newAmountPaid = loan.amount_paid + payment_amount;
    const newBalance = loan.balance - payment_amount;
    const newStatus = newBalance <= 0 ? 'paid' : 'active';

    const stmt = db.prepare(
      'UPDATE loans SET amount_paid = ?, balance = ?, status = ? WHERE id = ?'
    );
    stmt.run(newAmountPaid, newBalance, newStatus, id);

    // Record payment
    const paymentStmt = db.prepare(
      'INSERT INTO loan_payments (loan_id, amount, payment_date) VALUES (?, ?, date("now"))'
    );
    paymentStmt.run(id, payment_amount);

    return NextResponse.json({ message: 'Payment recorded', newBalance, newStatus });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const stmt = db.prepare('DELETE FROM loans WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ message: 'Loan deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete loan' }, { status: 500 });
  }
}
