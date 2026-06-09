'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const specializations = ['Cardiologist','Dermatologist','Pediatrician','Orthopedic','Gynecologist','Neurologist','ENT','Ophthalmologist','General Physician'];

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function getRating(id) { const h = id.split('').reduce((a,c)=> a + c.charCodeAt(0),0); return 3.5 + (h % 15) / 10; }
function getExperience(id) { const h = id.split('').reduce((a,c)=> a + c.charCodeAt(0),0); return 4 + (h % 17); }
function getQualification(spec) { return { Cardiologist:'MBBS, MD (Cardiology), DM', Dermatologist:'MBBS, MD (Dermatology)', Pediatrician:'MBBS, MD (Pediatrics)', Orthopedic:'MBBS, MS (Ortho)', Gynecologist:'MBBS, MD (OBG)', Neurologist:'MBBS, MD (Neurology), DM', ENT:'MBBS, MS (ENT)', Ophthalmologist:'MBBS, MS (Ophthal)', 'General Physician':'MBBS, MD (Medicine)' }[spec] || 'MBBS'; }
function getLanguages(id) { const l = ['English, Hindi','English, Hindi, Marathi','English, Hindi, Tamil','English, Hindi, Bengali','English, Hindi, Telugu','English, Hindi, Kannada']; return l[id.split('').reduce((a,c)=>a+c.charCodeAt(0),0) % l.length]; }
function getPatients(id) { return 500 + (id.split('').reduce((a,c)=>a+c.charCodeAt(0),0) % 4500); }

const specializationIcons = { Cardiologist:'❤️', Dermatologist:'🧴', Pediatrician:'👶', Orthopedic:'🦴', Gynecologist:'👩', Neurologist:'🧠', ENT:'👂', Ophthalmologist:'👁️', 'General Physician':'🏥' };

export default function PatientSearch() {
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef(null);
  const suggestRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target) && inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (name.length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    const timer = setTimeout(async () => {
      try {
        const p = new URLSearchParams({ name });
        if (specialization) p.set('specialization', specialization);
        if (location) p.set('location', location);
        const res = await fetch(`/api/doctors/search?${p}`);
        const data = await res.json();
        setSuggestions(data.doctors || []);
        setShowSuggestions(true);
        setHighlightIdx(-1);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [name, specialization, location]);

  const searchDoctors = async (e) => {
    e.preventDefault();
    setLoading(true); setSearched(true);
    try {
      const p = new URLSearchParams();
      if (specialization) p.set('specialization', specialization);
      if (location) p.set('location', location);
      if (name) p.set('name', name);
      const res = await fetch(`/api/doctors/search?${p}`);
      setDoctors((await res.json()).doctors || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const selectDoctor = (doc) => {
    setShowSuggestions(false);
    router.push(`/patient/doctor/${doc._id}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || !suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && highlightIdx >= 0) { e.preventDefault(); selectDoctor(suggestions[highlightIdx]); }
    else if (e.key === 'Escape') { setShowSuggestions(false); }
  };

  const getInitials = (n) => n?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Find a Doctor</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Search by specialization, location, or doctor name</p>
      </div>

      <form onSubmit={searchDoctors} className="card-lg mb-8 border-t-4 border-t-primary-500">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specialization</label>
            <select value={specialization} onChange={e => setSpecialization(e.target.value)} className="select-field"><option value="">All Specializations</option>{specializations.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City or area" className="input-field pl-10" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Doctor Name</label>
            <input ref={inputRef} type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} placeholder="Type doctor name..." className="input-field" autoComplete="off" />
            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestRef} className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                {suggestions.map((doc, idx) => (
                  <button key={doc._id} type="button" onMouseDown={() => selectDoctor(doc)} onMouseEnter={() => setHighlightIdx(idx)} className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${idx === highlightIdx ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xs shrink-0">{getInitials(doc.name)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{specializationIcons[doc.specialization] || '🏥'} {doc.specialization} &middot; {doc.location}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary-600 shrink-0">₹{doc.consultationFee}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">Showing verified doctors only</p>
          <button type="submit" disabled={loading} className="btn-primary inline-flex items-center">
            {loading ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Searching...</> : <><svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>Search Doctors</>}
          </button>
        </div>
      </form>

      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" /><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" /><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" /></div></div>
            </div>
          ))}
        </div>
      )}

      {!loading && doctors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">{doctors.length} doctor{doctors.length > 1 ? 's' : ''} found</p>
            <div className="flex gap-2 text-xs text-gray-400"><span>Sort: Best Match</span></div>
          </div>
          {doctors.map(doc => {
            const rating = getRating(doc._id), exp = getExperience(doc._id), qual = getQualification(doc.specialization), langs = getLanguages(doc._id), patients = getPatients(doc._id);
            return (
              <div key={doc._id} onClick={() => router.push(`/patient/doctor/${doc._id}`)} className="card p-5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-l-4 border-l-primary-400">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm ring-2 ring-primary-100 dark:ring-primary-900">{getInitials(doc.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2"><h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">{doc.name}</h3><span className="badge-green text-[10px]">Verified</span></div>
                        <p className="text-sm text-primary-600 font-medium">{specializationIcons[doc.specialization] || '🏥'} {doc.specialization}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{qual}</p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <div className="flex items-center gap-1"><Stars rating={rating} /><span className="text-xs font-medium text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span></div>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{exp} yrs exp.</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{patients}+ patients</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{doc.consultationFee}</p>
                        <p className="text-[10px] text-gray-400">Consultation fee</p>
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-heal-600 bg-heal-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-heal-500" />Available today</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{doc.location}</span>
                      <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>{langs}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && searched && doctors.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No doctors found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search filters or location</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-primary-50 dark:bg-teal-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Search for doctors</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Use the filters above to find the right doctor for you</p>
        </div>
      )}
    </div>
  );
}
