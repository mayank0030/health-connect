const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';

const DoctorSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  specialization: String, consultationFee: Number,
  location: String, about: String,
}, { timestamps: true });

const SlotSchema = new mongoose.Schema({
  doctorId: mongoose.Schema.Types.ObjectId,
  date: String, startTime: String, endTime: String,
  status: { type: String, default: 'available' },
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', DoctorSchema);
const Slot = mongoose.model('Slot', SlotSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Doctor.deleteMany({});
  await Slot.deleteMany({});
  console.log('Cleared existing data');

  const password = await bcrypt.hash('doctor123', 10);

  const doctors = await Doctor.insertMany([
    {
      name: 'Arun Sharma',
      email: 'arun@example.com',
      password,
      specialization: 'Cardiologist',
      consultationFee: 800,
      location: 'Mumbai, Maharashtra',
      about: 'Senior cardiologist with 15+ years of experience in interventional cardiology.',
    },
    {
      name: 'Priya Patel',
      email: 'priya@example.com',
      password,
      specialization: 'Dermatologist',
      consultationFee: 600,
      location: 'Delhi',
      about: 'Specializes in clinical and cosmetic dermatology.',
    },
    {
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password,
      specialization: 'Pediatrician',
      consultationFee: 500,
      location: 'Bangalore, Karnataka',
      about: 'Expert in child health and adolescent medicine.',
    },
    {
      name: 'Sneha Gupta',
      email: 'sneha@example.com',
      password,
      specialization: 'Gynecologist',
      consultationFee: 700,
      location: 'Pune, Maharashtra',
      about: 'Specializing in obstetrics and women health.',
    },
    {
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      password,
      specialization: 'Orthopedic',
      consultationFee: 900,
      location: 'Chennai, Tamil Nadu',
      about: 'Joint replacement and sports injury specialist.',
    },
    {
      name: 'Ananya Reddy',
      email: 'ananya@example.com',
      password,
      specialization: 'Neurologist',
      consultationFee: 1000,
      location: 'Hyderabad, Telangana',
      about: 'Neurology consultant with focus on stroke and epilepsy management.',
    },
    {
      name: 'Mohan Das',
      email: 'mohan@example.com',
      password,
      specialization: 'ENT',
      consultationFee: 400,
      location: 'Kolkata, West Bengal',
      about: 'Ear, nose, and throat specialist.',
    },
    {
      name: 'Deepa Iyer',
      email: 'deepa@example.com',
      password,
      specialization: 'Ophthalmologist',
      consultationFee: 550,
      location: 'Chennai, Tamil Nadu',
      about: 'Eye care and vision correction specialist.',
    },
  ]);

  console.log(`Seeded ${doctors.length} doctors`);

  const today = new Date();
  const slots = [];

  for (const doctor of doctors) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() + d);
      const dateStr = date.toISOString().split('T')[0];

      for (let h = 9; h < 17; h++) {
        for (let m = 0; m < 60; m += 30) {
          const startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          const endMin = m + 30;
          const endH = endMin >= 60 ? h + 1 : h;
          const endM = endMin >= 60 ? endMin - 60 : endMin;
          const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

          slots.push({
            doctorId: doctor._id,
            date: dateStr,
            startTime,
            endTime,
            status: 'available',
          });
        }
      }
    }
  }

  await Slot.insertMany(slots);
  console.log(`Seeded ${slots.length} slots`);

  console.log('');
  console.log('Test Credentials:');
  doctors.forEach(d => {
    console.log(`  ${d.email} / doctor123`);
  });

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
