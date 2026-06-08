import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Slot from '@/lib/models/Slot';
import Patient from '@/lib/models/Patient';
import Booking from '@/lib/models/Booking';
import { generateBookingId } from '@/lib/utils';

export async function POST(request) {
  try {
    await connectDB();
    const { slotId, name, age, phoneNumber, bloodGroup, medicalConditions, currentMedications } = await request.json();

    if (!slotId || !name || !age || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const generatedBookingId = generateBookingId();

    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: 'available' },
      { $set: { status: 'booked', bookingId: generatedBookingId } },
      { new: true }
    );

    if (!slot) {
      const nextAvailable = await Slot.findOne({
        doctorId: (await Slot.findById(slotId))?.doctorId,
        status: 'available',
        date: { $gte: new Date().toISOString().split('T')[0] },
      }).sort({ date: 1, startTime: 1 }).lean();

      return NextResponse.json({
        error: 'Slot already booked',
        nextAvailableSlot: nextAvailable || null,
      }, { status: 409 });
    }

    let patient = await Patient.findOne({ phoneNumber });
    if (patient) {
      patient.name = name;
      patient.age = age;
      if (bloodGroup) patient.bloodGroup = bloodGroup;
      if (medicalConditions) patient.medicalConditions = medicalConditions;
      if (currentMedications) patient.currentMedications = currentMedications;
      await patient.save();
    } else {
      patient = await Patient.create({
        name, age, phoneNumber,
        bloodGroup: bloodGroup || '',
        medicalConditions: medicalConditions || '',
        currentMedications: currentMedications || '',
      });
    }

    const booking = await Booking.create({
      bookingId: generatedBookingId,
      slotId: slot._id,
      patientId: patient._id,
      doctorId: slot.doctorId,
      status: 'confirmed',
    });

    return NextResponse.json({
      bookingId: generatedBookingId,
      booking,
      message: 'Booking confirmed',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
