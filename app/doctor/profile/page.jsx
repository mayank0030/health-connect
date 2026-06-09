'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const specializations = ['Cardiologist','Dermatologist','Pediatrician','Orthopedic','Gynecologist','Neurologist','ENT','Ophthalmologist','General Physician'];

export default function DoctorProfile() {
  const [form, setForm] = useState({ name: '', specialization: '', consultationFee: '', location: '', about: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/doctors/profile');
        if (!res.ok) { router.push('/doctor/login'); return; }
        const data = await res.json();
        const d = data.doctor;
        setForm({ name: d.name || '', specialization: d.specialization || '', consultationFee: String(d.consultationFee || ''), location: d.location || '', about: d.about || '' });
      } catch {} finally { setLoading(false); }
    }
    load();
  }, [router]);

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/doctors/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setMessage('Profile updated successfully'); setMsgType('success'); }
      else { const d = await res.json(); setMessage(d.error || 'Update failed'); setMsgType('error'); }
    } catch { setMessage('Network error'); setMsgType('error'); }
    finally { setSaving(false); setTimeout(() => setMessage(''), 4000); }
  };

  if (loading) return <div className="max-w-lg mx-auto animate-pulse space-y-6"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3" /><div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" /></div>;

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Edit Profile</h1>

      {message && (
        <div className={`${msgType === 'success' ? 'bg-heal-50 dark:bg-emerald-950 border-heal-200 dark:border-emerald-800 text-heal-700 dark:text-heal-400' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'} border rounded-2xl p-4 mb-5 animate-slide-down text-sm flex items-center gap-2`}>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={msgType === 'success' ? 'M5 13l4 4L19 7' : 'M12 9v2m0 4h.01'} />
          </svg>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-lg space-y-4 border-t-4 border-t-primary-500">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
          <input type="text" required value={form.name} onChange={e => update('name', e.target.value)} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specialization</label>
            <select required value={form.specialization} onChange={e => update('specialization', e.target.value)} className="select-field">
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fee (₹)</label>
            <input type="number" required min="0" value={form.consultationFee} onChange={e => update('consultationFee', e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
          <input type="text" required value={form.location} onChange={e => update('location', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">About</label>
          <textarea value={form.about} onChange={e => update('about', e.target.value)} className="input-field resize-none" rows="3" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary inline-flex items-center">
            {saving ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</> : 'Save Changes'}
          </button>
          <a href="/doctor/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</a>
        </div>
      </form>
    </div>
  );
}
