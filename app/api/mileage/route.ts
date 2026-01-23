import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Mileage } from '@/lib/types';

export const dynamic = 'force-dynamic';

// IRS standard mileage rate for 2024
const MILEAGE_RATE = 0.67;

export async function GET() {
  try {
    const mileage = db.prepare('SELECT * FROM mileage ORDER BY date DESC, id DESC').all() as Mileage[];
    
    // Calculate totals
    const totalMiles = mileage.reduce((sum, m) => sum + m.miles, 0);
    const deduction = totalMiles * MILEAGE_RATE;
    
    // Get the latest odometer reading for display
    const latestOdometer = mileage.length > 0 ? mileage[0].odometer : 0;
    
    return NextResponse.json({
      entries: mileage,
      totalMiles,
      deduction,
      rate: MILEAGE_RATE,
      latestOdometer
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mileage' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, odometer, notes } = body;

    if (!date || odometer === undefined) {
      return NextResponse.json({ error: 'Date and odometer reading are required' }, { status: 400 });
    }

    // Get the previous odometer reading (most recent entry before this date, or any previous entry)
    const previousEntry = db.prepare(`
      SELECT odometer FROM mileage 
      WHERE date <= ? 
      ORDER BY date DESC, id DESC 
      LIMIT 1
    `).get(date) as { odometer: number } | undefined;

    // Calculate miles driven (difference from previous reading)
    const previousOdometer = previousEntry?.odometer || 0;
    const miles = previousOdometer > 0 ? Math.max(0, odometer - previousOdometer) : 0;

    const stmt = db.prepare('INSERT INTO mileage (date, odometer, miles, notes) VALUES (?, ?, ?, ?)');
    const result = stmt.run(date, odometer, miles, notes || null);

    // If this entry was inserted before existing entries, recalculate miles for subsequent entries
    recalculateMiles();

    return NextResponse.json({ 
      id: result.lastInsertRowid, 
      date, 
      odometer, 
      miles, 
      notes,
      previousOdometer 
    }, { status: 201 });
  } catch (error) {
    console.error('Mileage POST error:', error);
    return NextResponse.json({ error: 'Failed to create mileage entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const stmt = db.prepare('DELETE FROM mileage WHERE id = ?');
    stmt.run(id);

    // Recalculate miles for all entries after deletion
    recalculateMiles();

    return NextResponse.json({ message: 'Mileage entry deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete mileage entry' }, { status: 500 });
  }
}

// Recalculate miles for all entries based on odometer readings
function recalculateMiles() {
  const entries = db.prepare('SELECT id, odometer FROM mileage ORDER BY date ASC, id ASC').all() as { id: number; odometer: number }[];
  
  let previousOdometer = 0;
  for (const entry of entries) {
    const miles = previousOdometer > 0 ? Math.max(0, entry.odometer - previousOdometer) : 0;
    db.prepare('UPDATE mileage SET miles = ? WHERE id = ?').run(miles, entry.id);
    previousOdometer = entry.odometer;
  }
}
