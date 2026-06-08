import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import Patient from '@/lib/models/Patient';
import Slot from '@/lib/models/Slot';
import Doctor from '@/lib/models/Doctor';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const booking = await Booking.findOne({ bookingId: params.bookingId })
      .populate('patientId')
      .populate('doctorId', '-password')
      .populate('slotId')
      .lean();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const { status, diagnosisNotes, prescription } = body;

    const update = {};
    if (status) update.status = status;
    if (diagnosisNotes !== undefined) update.diagnosisNotes = diagnosisNotes;
    if (prescription !== undefined) update.prescription = prescription;

    const booking = await Booking.findOneAndUpdate(
      { bookingId: params.bookingId },
      { $set: update },
      { new: true }
    ).populate('patientId').populate('slotId').lean();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
