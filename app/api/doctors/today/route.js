import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ error: 'doctorId is required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    const bookings = await Booking.find({ doctorId, status: { $ne: 'cancelled' } })
      .populate('patientId')
      .populate('slotId')
      .sort({ createdAt: -1 })
      .lean();

    const todayBookings = bookings.filter(b => b.slotId && b.slotId.date === today);

    return NextResponse.json({ bookings: todayBookings, date: today });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
