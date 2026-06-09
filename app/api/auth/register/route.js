import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Doctor from '@/lib/models/Doctor';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, specialization, consultationFee, location, about } = body;

    if (!name || !email || !password || !specialization || !consultationFee || !location) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    const existing = await Doctor.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'A doctor with this email already exists' }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const doctor = await Doctor.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      specialization,
      consultationFee: Number(consultationFee),
      location: location.trim(),
      about: about || '',
    });

    return NextResponse.json({
      message: 'Registration successful. Please login.',
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
