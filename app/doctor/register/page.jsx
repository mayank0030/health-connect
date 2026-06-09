'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const specializations = ['Cardiologist','Dermatologist','Pediatrician','Orthopedic','Gynecologist','Neurologist','ENT','Ophthalmologist','General Physician'];

export default function DoctorRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', consultationFee: '', location: '', about: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/doctor/login?registered=1');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md animate-scale-in">
        <div className="card-lg">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 dark:shadow-primary-900/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Doctor Registration</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your account to start accepting appointments</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-3 text-sm mb-4 flex items-start gap-2">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
              <input type="text" required value={form.name} onChange={e => update('name', e.target.value)} className="input-field" placeholder="Dr. Arun Sharma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
              <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="input-field" placeholder="doctor@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
              <input type="password" required minLength={6} value={form.password} onChange={e => update('password', e.target.value)} className="input-field" placeholder="Min 6 characters" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specialization *</label>
                <select required value={form.specialization} onChange={e => update('specialization', e.target.value)} className="select-field">
                  <option value="">Select</option>
                  {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fee (₹) *</label>
                <input type="number" required min="0" value={form.consultationFee} onChange={e => update('consultationFee', e.target.value)} className="input-field" placeholder="800" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location *</label>
              <input type="text" required value={form.location} onChange={e => update('location', e.target.value)} className="input-field" placeholder="Mumbai, Delhi, Bangalore..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">About</label>
              <textarea value={form.about} onChange={e => update('about', e.target.value)} className="input-field resize-none" rows="2" placeholder="Brief introduction about yourself..." />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 inline-flex items-center justify-center">
              {loading ? (
                <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Registering...</>
              ) : 'Create Account'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
          Already registered? <a href="/doctor/login" className="text-primary-600 hover:underline font-medium">Login here</a>
        </p>
      </div>
    </div>
  );
}
