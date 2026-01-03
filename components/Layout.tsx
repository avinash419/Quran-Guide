
import React from 'react';
import { AppSection } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentSection, setSection }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-white shadow-2xl shadow-stone-200/50 relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-stone-100/50 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setSection(AppSection.HOME)}
        >
          <div className="w-10 h-10 bg-emerald-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300 rotate-3 group-hover:rotate-0">
            <span className="text-xl font-serif font-bold">Q</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-emerald-950 tracking-tight leading-none">Quran Guide</h1>
            <p className="text-[10px] text-emerald-600/60 font-bold uppercase tracking-widest mt-0.5">Spiritual Path</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/50">
            हिन्दी
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-28">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-emerald-950/90 backdrop-blur-2xl rounded-3xl border border-white/10 flex justify-around p-2 z-50 shadow-2xl shadow-emerald-900/40">
        <NavButton 
          active={currentSection === AppSection.HOME} 
          onClick={() => setSection(AppSection.HOME)}
          label="मुख्य"
          icon={<HomeIcon />}
        />
        <NavButton 
          active={currentSection === AppSection.SITUATIONS} 
          onClick={() => setSection(AppSection.SITUATIONS)}
          label="मार्गदर्शन"
          icon={<CompassIcon />}
        />
        <NavButton 
          active={currentSection === AppSection.PRAYER_GUIDE} 
          onClick={() => setSection(AppSection.PRAYER_GUIDE)}
          label="नमाज़"
          icon={<PrayerIcon />}
        />
        <NavButton 
          active={currentSection === AppSection.SURAH_LIST || currentSection === AppSection.READER} 
          onClick={() => setSection(AppSection.SURAH_LIST)}
          label="तिलावत"
          icon={<BookIcon />}
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; label: string; icon: React.ReactNode; onClick: () => void }> = ({ active, label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-500 px-3 py-1.5 rounded-xl ${active ? 'bg-white/10 text-white scale-105' : 'text-emerald-200/40 hover:text-emerald-100'}`}
  >
    <span className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : ''}`}>{icon}</span>
    <span className={`text-[9px] font-black tracking-widest uppercase ${active ? 'opacity-100' : 'opacity-60'}`}>
      {label}
    </span>
  </button>
);

const HomeIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const CompassIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 15.123 6.257 18.112l2.99-8.785 8.784-2.99-2.99 8.785Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.008v.008H12V12Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const PrayerIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A4.833 4.833 0 0 1 12 12.75 4.833 4.833 0 0 1 4.5 10.332V21h15Z" />
  </svg>
);

const BookIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
  </svg>
);

export default Layout;
