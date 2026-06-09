import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Doctor from '@/lib/models/Doctor';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const doctor = await Doctor.findById(decoded.doctorId).select('-password').lean();
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

    return NextResponse.json({ doctor });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const body = await request.json();
    const { name, specialization, consultationFee, location, about } = body;

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (specialization !== undefined) update.specialization = specialization;
    if (consultationFee !== undefined) update.consultationFee = Number(consultationFee);
    if (location !== undefined) update.location = location.trim();
    if (about !== undefined) update.about = about;

    const doctor = await Doctor.findByIdAndUpdate(decoded.doctorId, { $set: update }, { new: true }).select('-password').lean();
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

    return NextResponse.json({ doctor, message: 'Profile updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
