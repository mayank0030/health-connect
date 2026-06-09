'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CancelBookingPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();
        setBooking(data.booking);
      } catch {} finally { setLoading(false); }
    }
    load();
  }, [bookingId]);

  const handleCancel = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (phone !== booking.patientId?.phoneNumber) {
        setError('Phone number does not match this booking');
        setSubmitting(false);
        return;
      }
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        setDone(true);
        if (booking.slotId) {
          await fetch(`/api/doctors/slots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId: booking.doctorId?._id, date: booking.slotId.date, slotId: booking.slotId._id }),
          });
        }
      } else {
        const d = await res.json();
        setError(d.error || 'Cancellation failed');
      }
    } catch { setError('Network error'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="max-w-md mx-auto animate-pulse space-y-6"><div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" /></div>;

  if (!booking) return <div className="text-center py-16"><p className="text-lg font-medium text-gray-900 dark:text-gray-100">Booking not found</p></div>;

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center animate-scale-in py-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Booking Cancelled</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Your appointment has been cancelled successfully.</p>
        <a href="/patient" className="btn-primary inline-flex items-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          Search doctors
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Cancel Appointment</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Enter your phone number to verify and cancel this booking.</p>

      <div className="card-lg mb-5 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 border-l-4 border-l-red-400">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-red-700 dark:text-red-400">
            <p className="font-medium">Booking: {booking.bookingId}</p>
            <p>{booking.doctorId?.name} — {booking.slotId?.date && new Date(booking.slotId.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.slotId?.startTime}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-3 text-sm mb-4 flex items-start gap-2">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleCancel} className="card-lg space-y-4 border-t-4 border-t-red-400">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number (used during booking)</label>
          <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="Enter your 10-digit phone number" />
        </div>
        <button type="submit" disabled={submitting || booking.status !== 'confirmed'} className="w-full btn-danger py-3 inline-flex items-center justify-center">
          {submitting ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Cancelling...</> : 'Cancel Appointment'}
        </button>
        {booking.status !== 'confirmed' && <p className="text-xs text-gray-400 text-center">This booking cannot be cancelled (status: {booking.status})</p>}
      </form>
    </div>
  );
}
