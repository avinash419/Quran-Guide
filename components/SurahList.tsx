
import React, { useState, useEffect } from 'react';
import { Surah } from '../types';
import { fetchSurahList } from '../services/quranApi';

interface SurahListProps {
  onSelect: (surah: Surah) => void;
}

const SurahList: React.FC<SurahListProps> = ({ onSelect }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSurahList().then(data => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.number.toString().includes(search)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200"></div>
        <p className="text-stone-300 font-bold text-[10px] uppercase tracking-widest">सूरह सूची तैयार हो रही है</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20">
      <div className="mb-6 sticky top-[72px] z-40 bg-white/90 backdrop-blur-md pb-4 pt-2">
        <div className="relative group">
          <input
            type="text"
            placeholder="सूरह खोजें (उदा. Fatiha)"
            className="w-full p-5 rounded-[1.5rem] bg-stone-50 border border-stone-100 text-stone-800 placeholder-stone-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredSurahs.map((s) => (
          <button
            key={s.number}
            onClick={() => onSelect(s)}
            className="w-full flex items-center justify-between p-5 bg-white border border-stone-50 rounded-[1.5rem] hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center bg-stone-50 text-stone-600 font-black rounded-2xl group-hover:bg-emerald-900 group-hover:text-white transition-all border border-stone-100">
                {s.number}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-stone-800 tracking-tight leading-none mb-1">{s.englishName}</h3>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{s.englishNameTranslation}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="arabic-text text-2xl text-emerald-950 mb-0.5">{s.name}</p>
              <p className="text-[9px] text-stone-300 font-bold uppercase tracking-widest">{s.numberOfAyahs} आयतें</p>
            </div>
          </button>
        ))}
        {filteredSurahs.length === 0 && (
          <div className="text-center py-20 text-stone-400 font-bold text-xs uppercase tracking-widest">
            कोई सूरह नहीं मिली
          </div>
        )}
      </div>
    </div>
  );
};

export default SurahList;
