'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) { router.push('/doctor/login'); return; }
        const meData = await meRes.json();
        setDoctor(meData.doctor);
        const bookingRes = await fetch(`/api/doctors/today?doctorId=${meData.doctor._id}`);
        const bookingData = await bookingRes.json();
        setBookings(bookingData.bookings || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  const handleLogout = () => { document.cookie = 'token=; path=/; max-age=0'; router.push('/doctor/login'); };
  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const completed = bookings.filter(b => b.status === 'completed').length;

  if (loading) {
    return <div className="animate-pulse space-y-6 max-w-3xl mx-auto"><div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl" /><div className="grid grid-cols-3 gap-3">{Array.from({length:3}).map((_,i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}</div><div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl w-1/2" />{Array.from({length:3}).map((_,i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}</div>;
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white mb-6 p-6 sm:p-8">
        <div className="absolute inset-0 medical-pattern opacity-30" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Good morning, Dr. {doctor?.name}</h1>
              <p className="text-white/70 text-sm mt-1">{doctor?.specialization} &middot; {today}</p>
              <p className="text-white/50 text-xs mt-1">
                <svg className="w-3 h-3 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {doctor?.location}
              </p>
            </div>
            <div className="flex gap-2">
              <a href="/doctor/slots" className="inline-flex items-center px-3 py-2 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors border border-white/10">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                Manage Slots
              </a>
              <button onClick={handleLogout} className="inline-flex items-center px-3 py-2 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors border border-white/10">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card-lg p-4 text-center border-l-4 border-l-primary-400">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bookings.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Today</p>
        </div>
        <div className="card-lg p-4 text-center border-l-4 border-l-yellow-400">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{confirmed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Waiting</p>
        </div>
        <div className="card-lg p-4 text-center border-l-4 border-l-heal-400">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Completed</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-teal-950 flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Today&apos;s Appointments</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{bookings.length} appointment{bookings.length !== 1 ? 's' : ''} scheduled</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="card-lg text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium">No appointments today</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Patients will appear here once they book a slot</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking._id} onClick={() => router.push(`/doctor/consultation/${booking.bookingId}`)} className="card p-4 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-l-4 border-l-primary-400">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ring-2 ring-primary-100 dark:ring-primary-900">
                  {getInitials(booking.patientId?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{booking.patientId?.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Age: {booking.patientId?.age} &middot; {booking.patientId?.phoneNumber}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${booking.status === 'confirmed' ? 'badge-yellow' : booking.status === 'completed' ? 'badge-green' : 'badge-red'}`}>
                        {booking.status === 'confirmed' ? 'Waiting' : booking.status === 'completed' ? 'Completed' : booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {booking.slotId?.startTime} - {booking.slotId?.endTime}
                    </span>
                    {booking.patientId?.bloodGroup && <span className="badge-blue">{booking.patientId.bloodGroup}</span>}
                    {booking.patientId?.medicalConditions && (
                      <span className="text-gray-400 dark:text-gray-500 truncate max-w-[120px]" title={booking.patientId.medicalConditions}>
                        🏥 {booking.patientId.medicalConditions.substring(0, 15)}{booking.patientId.medicalConditions.length > 15 ? '..' : ''}
                      </span>
                    )}
                  </div>
                  {booking.diagnosisNotes && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Dx:</span> {booking.diagnosisNotes}
                    </div>
                  )}
                  {!booking.diagnosisNotes && booking.status === 'confirmed' && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-xs text-coral-500 font-medium">Click to start consultation →</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
