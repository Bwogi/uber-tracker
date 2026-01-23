import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Loan } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Loan ID is required' }, { status: 400 });
    }

    const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id) as Loan;
    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    // Sum all payments for this loan
    const result = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM loan_payments WHERE loan_id = ?').get(id) as { total: number };
    const totalPaid = result.total;

    // Update loan with correct values
    const newBalance = loan.principal_amount - totalPaid;
    const newStatus = newBalance <= 0 ? 'paid' : 'active';

    db.prepare('UPDATE loans SET amount_paid = ?, balance = ?, status = ? WHERE id = ?')
      .run(totalPaid, Math.max(0, newBalance), newStatus, id);

    return NextResponse.json({ 
      message: 'Loan recalculated', 
      amount_paid: totalPaid,
      balance: Math.max(0, newBalance),
      status: newStatus
    });
  } catch (error) {
    console.error('Recalculate error:', error);
    return NextResponse.json({ error: 'Failed to recalculate loan' }, { status: 500 });
  }
}
