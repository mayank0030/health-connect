'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ConsultationPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) { router.push('/doctor/login'); return; }
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();
        setBooking(data.booking);
        setDiagnosisNotes(data.booking.diagnosisNotes || '');
        setPrescription(data.booking.prescription || '');
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [bookingId, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosisNotes, prescription, status: 'completed' }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (loading) {
    return <div className="max-w-2xl mx-auto animate-pulse space-y-6"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3" /><div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" /><div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" /></div>;
  }

  if (!booking) return <div className="text-center py-16"><p className="text-gray-900 dark:text-gray-100 font-medium">Booking not found</p></div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => router.back()} className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium mb-5 transition-colors">
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Patient Consultation</h1>

      <div className="card-lg mb-6 border-t-4 border-t-primary-500">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shrink-0 ring-4 ring-primary-100 dark:ring-primary-900">
            {getInitials(booking.patientId?.name)}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{booking.patientId?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Age: {booking.patientId?.age} &bull; Phone: {booking.patientId?.phoneNumber}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-1">Booking ID: {booking.bookingId}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Date</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{booking.slotId?.date && new Date(booking.slotId.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Time</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{booking.slotId?.startTime} - {booking.slotId?.endTime}</p>
          </div>
        </div>
      </div>

      <div className="card-lg mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 border-l-4 border-l-amber-400">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Patient Health Summary</h3>
        </div>
          <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2"><span className="text-gray-500 dark:text-gray-400">Blood Group:</span><span className="font-medium">{booking.patientId?.bloodGroup || 'Not provided'} {booking.patientId?.bloodGroup && <span className="badge-blue ml-1">{booking.patientId.bloodGroup}</span>}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Medical Conditions:</span><p className="font-medium mt-0.5">{booking.patientId?.medicalConditions || 'None reported'}</p></div>
          <div><span className="text-gray-500 dark:text-gray-400">Current Medications:</span><p className="font-medium mt-0.5">{booking.patientId?.currentMedications || 'None reported'}</p></div>
        </div>
      </div>

      <div className="card-lg space-y-5 border-t-4 border-t-coral-400">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
              </svg>
              Diagnosis Notes
            </span>
          </label>
          <textarea value={diagnosisNotes} onChange={(e) => setDiagnosisNotes(e.target.value)} className="input-field resize-none" rows="4" placeholder="Enter diagnosis, observations, and clinical notes..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Prescription
            </span>
          </label>
          <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} className="input-field resize-none font-mono text-sm" rows="4" placeholder={`1. Medication name - dosage - frequency\n2. Medication name - dosage - frequency\n\nNotes:`} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center">
            {saving ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</> : <><svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Save & Complete</>}
          </button>
          {saved && <span className="inline-flex items-center gap-1 text-sm text-heal-600 font-medium animate-slide-down"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Saved successfully</span>}
        </div>
      </div>
    </div>
  );
}
