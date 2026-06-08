import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Slot from '@/lib/models/Slot';
import { generateTimeSlots, getNext7Days } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const dates = getNext7Days();

    for (const date of dates) {
      const existingSlots = await Slot.countDocuments({ doctorId: params.id, date });
      if (existingSlots === 0) {
        const slots = generateTimeSlots(params.id, date);
        await Slot.insertMany(slots);
      }
    }

    const slots = await Slot.find({
      doctorId: params.id,
      date: { $in: dates },
      status: { $in: ['available', 'booked'] },
    }).sort({ date: 1, startTime: 1 }).lean();

    return NextResponse.json({ slots, dates });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
