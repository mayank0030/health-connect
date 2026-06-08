import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked', 'blocked'], default: 'available', index: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  bookingId: { type: String, default: null },
}, { timestamps: true });

SlotSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });

export default mongoose.models.Slot || mongoose.model('Slot', SlotSchema);
