import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Loan, LoanPayment } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loanId = searchParams.get('loan_id');
    
    // If loan_id is provided, return payments for that loan
    if (loanId) {
      const payments = db.prepare(
        'SELECT * FROM loan_payments WHERE loan_id = ? ORDER BY payment_date DESC, id DESC'
      ).all(loanId) as LoanPayment[];
      return NextResponse.json(payments);
    }
    
    // Otherwise return all loans
    const loans = db.prepare('SELECT * FROM loans ORDER BY created_at DESC').all() as Loan[];
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
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
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { id, payment_amount } = body;

  if (!id || !payment_amount) {
    return NextResponse.json({ error: 'ID and payment amount are required' }, { status: 400 });
  }

  try {
    // Get current loan
    const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id) as Loan;
    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    // Calculate new values
    const newAmountPaid = loan.amount_paid + payment_amount;
    const newBalance = loan.balance - payment_amount;
    const newStatus = newBalance <= 0 ? 'paid' : 'active';
    const today = new Date().toISOString().split('T')[0];

    // Use transaction for atomicity
    const recordPayment = db.transaction(() => {
      db.prepare(
        'UPDATE loans SET amount_paid = ?, balance = ?, status = ? WHERE id = ?'
      ).run(newAmountPaid, newBalance, newStatus, id);

      const result = db.prepare(
        'INSERT INTO loan_payments (loan_id, amount, payment_date) VALUES (?, ?, ?)'
      ).run(id, payment_amount, today);

      return result.lastInsertRowid;
    });

    const paymentId = recordPayment();

    return NextResponse.json({ 
      message: 'Payment recorded', 
      paymentId,
      newBalance, 
      newStatus 
    });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const paymentId = searchParams.get('payment_id');

    if (!id && !paymentId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Delete a payment and recalculate loan balance
    if (paymentId) {
      // Get the payment first
      const payment = db.prepare('SELECT * FROM loan_payments WHERE id = ?').get(paymentId) as LoanPayment;
      if (!payment) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      }

      // Delete the payment
      db.prepare('DELETE FROM loan_payments WHERE id = ?').run(paymentId);

      // Recalculate loan totals
      recalculateLoanBalance(payment.loan_id);

      return NextResponse.json({ message: 'Payment deleted and balance updated' });
    }

    // Delete a loan (and its payments via CASCADE)
    const stmt = db.prepare('DELETE FROM loans WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ message: 'Loan deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

// Helper function to recalculate loan balance from payments
function recalculateLoanBalance(loanId: number) {
  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(loanId) as Loan;
  if (!loan) return;

  // Sum all payments for this loan
  const result = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM loan_payments WHERE loan_id = ?').get(loanId) as { total: number };
  const totalPaid = result.total;

  // Update loan
  const newBalance = loan.principal_amount - totalPaid;
  const newStatus = newBalance <= 0 ? 'paid' : 'active';

  db.prepare('UPDATE loans SET amount_paid = ?, balance = ?, status = ? WHERE id = ?')
    .run(totalPaid, Math.max(0, newBalance), newStatus, loanId);
}
