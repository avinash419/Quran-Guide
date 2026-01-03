
import React, { useState, useEffect } from 'react';
import { fetchRandomAyah } from '../services/quranApi';

const DailyAyah: React.FC = () => {
  const [ayah, setAyah] = useState<{ arabic: string; hindi: string; reference: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDailyAyah = async () => {
      const today = new Date().toDateString();
      const saved = localStorage.getItem('dailyAyah');
      const savedDate = localStorage.getItem('dailyAyahDate');

      if (saved && savedDate === today) {
        setAyah(JSON.parse(saved));
        setLoading(false);
      } else {
        try {
          const newAyah = await fetchRandomAyah();
          setAyah(newAyah);
          localStorage.setItem('dailyAyah', JSON.stringify(newAyah));
          localStorage.setItem('dailyAyahDate', today);
        } catch (error) {
          console.error("Failed to load ayah", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDailyAyah();
  }, []);

  if (loading) {
    return (
      <div className="bg-stone-50 rounded-[2.5rem] p-10 mx-6 h-80 flex flex-col justify-center items-center gap-4 border border-stone-100">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-700 animate-spin"></div>
        <p className="text-emerald-900/40 font-bold text-xs uppercase tracking-[0.2em]">आयत लोड हो रही है</p>
      </div>
    );
  }

  return (
    <div className="mx-6 relative group">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-white rounded-[2.5rem] p-10 shadow-xl border border-emerald-100/30 overflow-hidden min-h-[320px] flex flex-col">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none select-none -mr-20 -mt-20 transform rotate-12">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#064E3B" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87,-15.7,85.2,-0.9C83.5,13.8,76.6,27.7,68.4,40.1C60.1,52.4,50.5,63.2,38.6,71.1C26.6,79,13.3,84.1,-0.7,85.4C-14.7,86.6,-29.4,84.1,-42.6,77.2C-55.8,70.3,-67.4,59.1,-75.4,45.8C-83.3,32.5,-87.6,17.2,-87.3,1.9C-87,-13.3,-82.1,-28.6,-73.4,-41C-64.7,-53.4,-52.1,-62.9,-38.7,-70.1C-25.3,-77.3,-12.7,-82.1,1,-83.9C14.7,-85.6,29.4,-84.3,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
        </div>

        <div className="relative z-10 flex flex-col flex-grow gap-8">
          <div className="flex justify-between items-center border-b border-emerald-50 pb-4">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-800">आज की आयत</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold px-2 py-1 bg-emerald-50 rounded-lg">{ayah?.reference}</span>
          </div>
          
          <div className="flex-grow flex flex-col justify-center gap-8">
            <p className="arabic-text text-3xl md:text-4xl leading-[1.6] text-center text-emerald-950 font-medium">
              {ayah?.arabic}
            </p>
            
            <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-emerald-100"></div>
                <div className="w-2 h-2 rotate-45 border border-emerald-200"></div>
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-emerald-100"></div>
            </div>
            
            <p className="text-sm md:text-base leading-relaxed text-stone-500 text-center font-medium italic">
              “{ayah?.hindi}”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyAyah;
