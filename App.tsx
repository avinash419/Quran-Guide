
import React, { useState } from 'react';
import { AppSection, Surah } from './types';
import Layout from './components/Layout';
import DailyAyah from './components/DailyAyah';
import SurahList from './components/SurahList';
import SituationGuide from './components/SituationGuide';
import Reader from './components/Reader';

const App: React.FC = () => {
  const [section, setSection] = useState<AppSection>(AppSection.HOME);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    setSection(AppSection.READER);
  };

  const renderContent = () => {
    switch (section) {
      case AppSection.HOME:
        return (
          <div className="space-y-12 md:space-y-16 pt-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <header className="px-8 text-center space-y-4">
               <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-emerald-100/50 mb-2">
                  आध्यात्मिक सुकून
               </div>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-[1.1] serif-heading">
                अपने दिल को <br/> <span className="text-emerald-700 italic">शांति</span> प्रदान करें
              </h2>
              <p className="text-stone-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">कुरान की आयतों के माध्यम से जीवन की चुनौतियों का समाधान और आध्यात्मिक शांति प्राप्त करें।</p>
            </header>
            
            <DailyAyah />

            <div className="px-6 space-y-8">
              <div className="flex items-center gap-4 px-2">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] whitespace-nowrap">सुविधाएं चुनें</h3>
                  <div className="h-[1px] w-full bg-stone-100"></div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <button 
                  onClick={() => setSection(AppSection.SITUATIONS)}
                  className="group p-8 bg-white rounded-[2.5rem] text-left transition-all duration-500 border border-stone-50 shadow-xl shadow-stone-200/30 hover:shadow-emerald-900/10 active:scale-[0.98] relative overflow-hidden"
                >
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 group-hover:bg-emerald-900 group-hover:text-white">
                        <span>✨</span>
                    </div>
                    <div>
                        <span className="font-black text-stone-900 block text-xl serif-heading">जीवन मार्गदर्शन</span>
                        <span className="text-[10px] text-stone-400 font-black uppercase tracking-wider mt-1 block">स्थिति अनुसार आयतें खोजें</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 opacity-20 -mr-12 -mt-12 rounded-full"></div>
                </button>

                <button 
                  onClick={() => setSection(AppSection.SURAH_LIST)}
                  className="group p-8 bg-white rounded-[2.5rem] text-left transition-all duration-500 border border-stone-50 shadow-xl shadow-stone-200/30 hover:shadow-emerald-900/10 active:scale-[0.98] relative overflow-hidden"
                >
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 group-hover:bg-emerald-900 group-hover:text-white">
                        <span>📖</span>
                    </div>
                    <div>
                        <span className="font-black text-stone-900 block text-xl serif-heading">कुरान तिलावत</span>
                        <span className="text-[10px] text-stone-400 font-black uppercase tracking-wider mt-1 block">सभी सूरह और अनुवाद पढ़ें</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 opacity-20 -mr-12 -mt-12 rounded-full"></div>
                </button>
              </div>
            </div>

            <footer className="px-10 py-16 text-center space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center grayscale opacity-40">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em] leading-relaxed max-w-[220px] mx-auto">
                    शून्य ट्रैकिंग • पूर्ण गोपनीयता • कोई विज्ञापन नहीं
                </p>
              </div>
              <div className="h-[1px] w-8 bg-stone-100 mx-auto"></div>
              <p className="text-[8px] text-stone-300 font-bold uppercase tracking-widest">v1.1.0 • पवित्र मार्गदर्शन के लिए</p>
            </footer>
          </div>
        );
      case AppSection.SURAH_LIST:
        return <SurahList onSelect={handleSurahSelect} />;
      case AppSection.SITUATIONS:
        return <SituationGuide />;
      case AppSection.READER:
        return selectedSurah ? (
          <Reader surah={selectedSurah} onBack={() => setSection(AppSection.SURAH_LIST)} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Layout currentSection={section} setSection={setSection}>
      {renderContent()}
    </Layout>
  );
};

export default App;
