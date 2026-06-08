'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <div className={`space-y-12 sm:space-y-20 pb-12 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-teal-950">
        <div className="absolute inset-0 medical-pattern" />
        <div className="absolute bottom-0 left-0 right-0 h-20 ecg-line" />
        <div className="relative px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-heal-400 animate-pulse" />
              <span className="text-white/70 text-sm font-medium tracking-wide">✦ Trusted by 500+ clinics across India</span>
            </div>
            <div className="grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-4">
                  Your Health,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-heal-300 to-emerald-200">Connected.</span>
                </h1>
                <p className="text-base sm:text-lg text-white/70 max-w-xl mb-6 leading-relaxed">
                  India&apos;s trusted platform for finding the right doctor, booking appointments instantly, and keeping your medical history in one secure place.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a href="/patient" className="inline-flex items-center justify-center px-7 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl group">
                    <svg className="w-5 h-5 mr-2 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                    Find a Doctor
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </a>
                  <a href="/doctor/login" className="inline-flex items-center justify-center px-7 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Doctor Portal
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {['Free registration', 'Instant confirmation', 'Secure records'].map(t => (
                    <div key={t} className="flex items-center gap-2 text-white/60">
                      <svg className="w-4 h-4 text-heal-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:flex lg:col-span-2 justify-center">
                <div className="relative">
                  <div className="w-64 h-80 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 p-6 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-heal-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">24/7 Access</p>
                    <p className="text-white/50 text-xs text-center">Book appointments anytime, anywhere</p>
                    <div className="mt-4 w-full space-y-2">
                      <div className="h-2 bg-white/10 rounded-full w-full" />
                      <div className="h-2 bg-white/10 rounded-full w-3/4" />
                      <div className="h-2 bg-heal-500/30 rounded-full w-1/2" />
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow"><span className="text-white text-xs font-bold">Live</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <FeatureCard icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>} title="Smart Search" desc="Filter by specialization, location, ratings, and fees. Find the perfect doctor in seconds." color="bg-primary-50 dark:bg-teal-950 text-primary-600 dark:text-primary-400" border="border-primary-200 dark:border-teal-800" />
        <FeatureCard icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} title="Real-time Slots" desc="Live availability for the next 7 days. Book in under a minute with instant confirmation." color="bg-coral-50 dark:bg-rose-950 text-coral-600 dark:text-coral-400" border="border-coral-200 dark:border-rose-800" />
        <FeatureCard icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>} title="Digital Records" desc="Your health summary — blood group, conditions, medications — shared securely with your doctor." color="bg-heal-50 dark:bg-emerald-950 text-heal-600 dark:text-heal-400" border="border-heal-200 dark:border-emerald-800" />
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10 shadow-sm transition-colors duration-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-teal-950 text-primary-600 dark:text-primary-400 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            Why HealthConnect?
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Built for Indian Healthcare</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">We understand the challenges patients and doctors face every day.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: '🏥', number: '500+', label: 'Partner Clinics', desc: 'Across major cities' },
            { icon: '👨‍⚕️', number: '2,000+', label: 'Registered Doctors', desc: 'Verified professionals' },
            { icon: '📅', number: '10,000+', label: 'Monthly Bookings', desc: 'And growing daily' },
            { icon: '⭐', number: '4.8', label: 'Average Rating', desc: 'From patient reviews' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{stat.number}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center pb-4">
        <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400 dark:text-gray-500">
          <span>Trusted by:</span>
          {['Apollo','Max Healthcare','Fortis','Medanta','Narayana Health'].map(h => (
            <span key={h} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium text-gray-600 dark:text-gray-400">{h}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, border }) {
  return (
    <div className={`card p-6 border-l-4 ${border} hover:-translate-y-0.5 transition-all duration-300`}>
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
