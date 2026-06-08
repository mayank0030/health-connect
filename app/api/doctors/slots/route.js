import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Slot from '@/lib/models/Slot';

export async function POST(request) {
  try {
    await connectDB();
    const { doctorId, date, startTime, endTime } = await request.json();

    if (!doctorId || !date) {
      return NextResponse.json({ error: 'doctorId and date are required' }, { status: 400 });
    }

    if (startTime && endTime) {
      await Slot.updateMany(
        { doctorId, date, startTime: { $gte: startTime }, endTime: { $lte: endTime }, status: 'available' },
        { $set: { status: 'blocked' } }
      );
    } else {
      await Slot.updateMany(
        { doctorId, date, status: 'available' },
        { $set: { status: 'blocked' } }
      );
    }

    return NextResponse.json({ message: 'Slots blocked successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    if (!doctorId || !date) {
      return NextResponse.json({ error: 'doctorId and date are required' }, { status: 400 });
    }

    await Slot.updateMany(
      { doctorId, date, status: 'blocked' },
      { $set: { status: 'available' } }
    );

    return NextResponse.json({ message: 'Slots unblocked successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
