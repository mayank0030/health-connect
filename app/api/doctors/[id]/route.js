import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Doctor from '@/lib/models/Doctor';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const doctor = await Doctor.findById(params.id).select('-password').lean();
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    return NextResponse.json({ doctor });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
