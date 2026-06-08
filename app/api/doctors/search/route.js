import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Doctor from '@/lib/models/Doctor';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const location = searchParams.get('location');
    const name = searchParams.get('name');

    const query = {};
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const doctors = await Doctor.find(query).select('-password').lean();
    return NextResponse.json({ doctors });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
