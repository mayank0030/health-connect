import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Doctor from '@/lib/models/Doctor';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const doctor = await Doctor.findById(decoded.doctorId).select('-password').lean();

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ doctor });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
