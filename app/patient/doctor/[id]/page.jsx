'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DoctorProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [docRes, slotsRes] = await Promise.all([
          fetch(`/api/doctors/${id}`),
          fetch(`/api/doctors/${id}/slots`),
        ]);
        const docData = await docRes.json();
        const slotsData = await slotsRes.json();
        setDoctor(docData.doctor);
        setSlots(slotsData.slots || []);
        setDates(slotsData.dates || []);
        if (slotsData.dates?.length > 0) setSelectedDate(slotsData.dates[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function getRating(id) {
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return 3.5 + (hash % 15) / 10;
  }

  function getExperience(id) {
    const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return 4 + (hash % 17);
  }

  const filteredSlots = slots.filter(s => s.date === selectedDate && s.status === 'available');
  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const rating = doctor ? getRating(doctor._id) : 0;
  const exp = doctor ? getExperience(doctor._id) : 0;

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
        <div className="card-lg"><div className="flex items-center gap-4"><div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800" /><div className="flex-1 space-y-2"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3" /><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" /><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" /></div></div></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-full" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Array.from({length:8}).map((_,i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}</div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="text-center py-16"><p className="text-lg font-medium text-gray-900 dark:text-gray-100">Doctor not found</p><a href="/patient" className="text-primary-600 hover:underline text-sm mt-2 inline-block">{'←'} Back to search</a></div>;
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="card-lg mb-6 relative overflow-hidden border-t-4 border-t-primary-500">
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-primary-50/60 dark:from-primary-900/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shrink-0 ring-4 ring-primary-100">
            {getInitials(doctor.name)}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{doctor.name}</h1>
                <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {doctor.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {rating.toFixed(1)}
                  </span>
                  <span>{exp} yrs exp.</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-heal-50 dark:bg-emerald-950 text-heal-600 dark:text-heal-400 px-4 py-2.5 rounded-xl border border-heal-200 dark:border-emerald-800">
                <span className="text-2xl font-bold">₹{doctor.consultationFee}</span>
                <span className="text-xs">/visit</span>
              </div>
            </div>
            {doctor.about && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5 leading-relaxed border border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">About: </span>{doctor.about}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Available Slots</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">Select a date and time slot to book your appointment</p>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-5">
        {dates.map((date) => {
          const count = slots.filter(s => s.date === date && s.status === 'available').length;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                selectedDate === date
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 ring-2 ring-primary-300'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <div>{formatDate(date)}</div>
              <div className={`text-xs mt-0.5 ${selectedDate === date ? 'text-white/70' : 'text-gray-400'}`}>{count} slot{count !== 1 ? 's' : ''}</div>
            </button>
          );
        })}
      </div>

      {filteredSlots.length === 0 ? (
        <div className="card-lg text-center py-10">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium">No available slots</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try selecting a different date</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-block w-3 h-3 rounded bg-heal-400" /> Available
            <span className="ml-3 text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-400 dark:text-gray-500">{filteredSlots.length} slot{filteredSlots.length !== 1 ? 's' : ''} available on {formatDate(selectedDate)}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredSlots.map((slot) => (
              <button
                key={slot._id}
                onClick={() => router.push(`/patient/book/${slot._id}`)}
                className="card p-4 text-center hover:border-primary-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group border-heal-200 border-2"
              >
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{slot.startTime}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{slot.endTime}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-heal-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-heal-500" />
                  Available
                </div>
                <div className="mt-1.5 text-xs text-coral-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  Book now →
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
