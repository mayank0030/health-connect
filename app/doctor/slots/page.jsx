'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SlotManagement() {
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) { router.push('/doctor/login'); return; }
        const meData = await meRes.json();
        setDoctor(meData.doctor);
        await loadSlots(meData.doctor._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function loadSlots(doctorId) {
    const res = await fetch(`/api/doctors/${doctorId}/slots`);
    const data = await res.json();
    setSlots(data.slots || []);
    setDates(data.dates || []);
    if (data.dates?.length > 0 && !selectedDate) setSelectedDate(data.dates[0]);
  }

  async function blockDate() {
    if (!doctor) return;
    const res = await fetch('/api/doctors/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId: doctor._id, date: selectedDate }),
    });
    if (res.ok) {
      setMessage('All slots blocked for leave/holiday');
      setMsgType('success');
      await loadSlots(doctor._id);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function unblockDate() {
    if (!doctor) return;
    const res = await fetch(`/api/doctors/slots?doctorId=${doctor._id}&date=${selectedDate}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setMessage('All slots unblocked and available again');
      setMsgType('success');
      await loadSlots(doctor._id);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  const filteredSlots = slots.filter(s => s.date === selectedDate);
  const statusCounts = {
    available: filteredSlots.filter(s => s.status === 'available').length,
    booked: filteredSlots.filter(s => s.status === 'booked').length,
    blocked: filteredSlots.filter(s => s.status === 'blocked').length,
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl w-1/2" />
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-4 gap-3">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Slot Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Block or unblock slots for leave and holidays</p>
        </div>
        <a href="/doctor/dashboard" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </a>
      </div>

      {message && (
        <div className={`${msgType === 'success' ? 'bg-heal-50 dark:bg-emerald-950 border-heal-200 dark:border-emerald-800 text-heal-700 dark:text-heal-400' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'} border rounded-2xl p-4 mb-5 animate-slide-down text-sm flex items-center gap-2`}>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {message}
        </div>
      )}

      <div className="card-lg mb-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-5">
          {dates.map((date) => {
            const blocked = slots.filter(s => s.date === date && s.status === 'blocked').length;
            const total = slots.filter(s => s.date === date).length;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                  selectedDate === date
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div>{formatDate(date)}</div>
                <div className={`text-xs mt-0.5 ${selectedDate === date ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
                  {blocked}/{total} blocked
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button onClick={blockDate} className="btn-danger inline-flex items-center text-sm">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Block All — Mark as Leave
          </button>
          <button onClick={unblockDate} className="btn-success inline-flex items-center text-sm">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Unblock All — Make Available
          </button>
        </div>
      </div>

      {selectedDate && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Slots for {formatDate(selectedDate)}
            </h2>
            <div className="flex gap-2 text-xs">
              <span className="badge-green">{statusCounts.available} available</span>
              <span className="badge-yellow">{statusCounts.booked} booked</span>
              <span className="badge-red">{statusCounts.blocked} blocked</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredSlots.map((slot) => (
              <div
                key={slot._id}
                className={`rounded-2xl p-4 text-center border transition-all duration-200 ${
                  slot.status === 'available' ? 'bg-white dark:bg-gray-800 border-heal-200 dark:border-emerald-800' :
                  slot.status === 'booked' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                  'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{slot.startTime}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{slot.endTime}</p>
                <span className={`inline-flex items-center mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  slot.status === 'available' ? 'bg-heal-100 text-heal-600' :
                  slot.status === 'booked' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {slot.status === 'available' ? 'Available' :
                   slot.status === 'booked' ? 'Booked' : 'Blocked'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
