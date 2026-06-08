'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [slot, setSlot] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({
    name: '', age: '', phoneNumber: '',
    bloodGroup: '', medicalConditions: '', currentMedications: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [nextSlot, setNextSlot] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const slotsRes = await fetch(`/api/doctors/${id.split('-')[0]}/slots`);
        const slotsData = await slotsRes.json();
        const thisSlot = slotsData.slots?.find(s => s._id === id);
        if (thisSlot) {
          setSlot(thisSlot);
          const docRes = await fetch(`/api/doctors/${thisSlot.doctorId}`);
          const docData = await docRes.json();
          setDoctor(docData.doctor);
        }
      } catch (err) { console.error(err); }
    }
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setNextSlot(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: id, ...form, age: parseInt(form.age) }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setError('This slot was just booked by someone else.');
        if (data.nextAvailableSlot) setNextSlot(data.nextAvailableSlot);
        return;
      }
      if (res.ok) {
        router.push(`/patient/confirmation/${data.bookingId}`);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Book Appointment</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm ml-7">Complete your details to confirm the booking</p>
      </div>

      {slot && doctor && (
        <div className="card-lg mb-6 bg-gradient-to-r from-primary-50 dark:from-primary-900/20 to-teal-50 dark:to-teal-900/20 border-l-4 border-l-primary-500">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-teal-950 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{doctor.name}</p>
              <p className="text-sm text-primary-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {slot.date && new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {slot.startTime} - {slot.endTime}
              </p>
              <div className="inline-flex items-center gap-1 mt-1.5 bg-heal-50 dark:bg-emerald-950 text-heal-600 dark:text-heal-400 text-sm font-medium px-2.5 py-0.5 rounded-full">₹{doctor.consultationFee}</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl p-4 mb-5 animate-slide-down">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <div>
              <p className="font-medium text-sm">{error}</p>
              {nextSlot && (
                <button onClick={() => router.push(`/patient/book/${nextSlot._id}`)} className="mt-2 text-sm text-primary-600 hover:underline font-medium">
                  View next available slot →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-lg space-y-5 border-t-4 border-t-coral-400">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Patient Details</h3>
            <span className="text-xs text-red-400">*Required</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 ml-7">Who is this appointment for?</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" required value={form.name} onChange={(e) => updateField('name', e.target.value)} className="input-field" placeholder="Enter patient name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                <input type="number" required min="0" max="150" value={form.age} onChange={(e) => updateField('age', e.target.value)} className="input-field" placeholder="Age" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input type="tel" required value={form.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)} className="input-field" placeholder="10-digit number" />
              </div>
            </div>
          </div>
        </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-heal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Health Summary</h3>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 ml-7">Visible to your doctor before consultation</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
              <select value={form.bloodGroup} onChange={(e) => updateField('bloodGroup', e.target.value)} className="select-field">
                <option value="">Select blood group</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Known Medical Conditions</label>
              <textarea value={form.medicalConditions} onChange={(e) => updateField('medicalConditions', e.target.value)} className="input-field resize-none" rows="2" placeholder="e.g., Diabetes, Hypertension, Asthma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Medications</label>
              <textarea value={form.currentMedications} onChange={(e) => updateField('currentMedications', e.target.value)} className="input-field resize-none" rows="2" placeholder="e.g., Metformin 500mg, Amlodipine 5mg" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="w-full btn-primary py-3.5 text-base inline-flex items-center justify-center">
          {submitting ? (
            <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Booking...</>
          ) : `Confirm Booking — ₹${doctor?.consultationFee || 0}`}
        </button>
      </form>
    </div>
  );
}
