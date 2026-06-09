'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();
        setBooking(data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto animate-pulse space-y-6">
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Booking not found</p>
        <a href="/patient" className="text-primary-600 hover:underline text-sm mt-2 inline-block">← Back to search</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-scale-in">
      <div className="bg-gradient-to-br from-heal-500 to-heal-600 rounded-2xl p-8 text-center text-white mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-1">Booking Confirmed!</h1>
          <p className="text-white/80 text-sm">Your appointment has been booked successfully</p>
        </div>
      </div>

      <div className="card-lg space-y-5">
        <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-1">Booking ID</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 font-mono tracking-wider">{booking.bookingId}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Doctor" value={booking.doctorId?.name} />
          <DetailItem label="Specialization" value={booking.doctorId?.specialization} />
          <DetailItem
            label="Date"
            value={booking.slotId?.date && new Date(booking.slotId.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          />
          <DetailItem label="Time" value={`${booking.slotId?.startTime} - ${booking.slotId?.endTime}`} />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-2">Patient</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-teal-950 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
              {booking.patientId?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{booking.patientId?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Age: {booking.patientId?.age} | {booking.patientId?.phoneNumber}</p>
            </div>
          </div>
        </div>

        {(booking.patientId?.bloodGroup || booking.patientId?.medicalConditions) && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-3">Health Summary Shared</p>
            {booking.patientId?.bloodGroup && (
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-blue">Blood: {booking.patientId.bloodGroup}</span>
              </div>
            )}
            {booking.patientId?.medicalConditions && (
              <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Conditions:</span> {booking.patientId.medicalConditions}</p>
            )}
            {booking.patientId?.currentMedications && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><span className="font-medium">Medications:</span> {booking.patientId.currentMedications}</p>
            )}
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs">Please carry any previous medical reports for your consultation</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-center">
        <a href="/patient" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Search more doctors
        </a>
        <div>
          <a href={`/patient/cancel/${bookingId}`} className="inline-flex items-center text-red-500 hover:text-red-600 font-medium text-xs transition-colors">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel this booking
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{value || '—'}</p>
    </div>
  );
}
