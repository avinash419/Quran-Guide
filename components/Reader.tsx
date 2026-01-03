
import React, { useState, useEffect, useRef } from 'react';
import { Surah, Ayah } from '../types';
import { fetchSurahDetails, getAudioUrl } from '../services/quranApi';
import { speakHindi } from '../services/ttsService';
import { getAyahReflection } from '../services/geminiService';

interface ReaderProps {
  surah: Surah;
  onBack: () => void;
}

const Reader: React.FC<ReaderProps> = ({ surah, onBack }) => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [hindi, setHindi] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(28);
  const [reflections, setReflections] = useState<Record<number, { text: string; loading: boolean }>>({});
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSurahDetails(surah.number).then(data => {
      setAyahs(data.ayahs);
      setHindi(data.translation);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return () => {
      window.speechSynthesis.cancel();
      audioRef.current?.pause();
    };
  }, [surah.number]);

  const handleSpeakHindi = (text: string, id: number) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      audioRef.current?.pause();
      setPlayingId(null);
      setSpeakingId(id);
      speakHindi(text, () => setSpeakingId(null));
    }
  };

  const toggleAudio = (ayahNumber: number) => {
    if (playingId === ayahNumber) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      
      const url = getAudioUrl(ayahNumber);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setPlayingId(ayahNumber);
      
      audioRef.current.onended = () => {
        setPlayingId(null);
        const currentIndex = ayahs.findIndex(a => a.number === ayahNumber);
        const translationText = hindi[currentIndex]?.text;
        if (translationText) {
          handleSpeakHindi(translationText, ayahNumber);
        }
      };
    }
  };

  const handleGenerateReflection = async (ayah: Ayah, hindiText: string) => {
    if (reflections[ayah.number]) return;

    setReflections(prev => ({ ...prev, [ayah.number]: { text: '', loading: true } }));
    
    try {
        const text = await getAyahReflection(ayah.text, hindiText, surah.englishName, ayah.numberInSurah);
        setReflections(prev => ({ ...prev, [ayah.number]: { text, loading: false } }));
    } catch (error) {
        setReflections(prev => ({ ...prev, [ayah.number]: { text: 'चिंतन लोड करने में त्रुटि हुई।', loading: false } }));
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-pulse">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-700 animate-spin"></div>
            <p className="text-emerald-900/40 font-bold text-xs uppercase tracking-[0.3em]">तिलावत लोड हो रही है</p>
        </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-xl border-b border-stone-100 px-4 py-3 flex justify-between items-center shadow-sm">
        <button 
            onClick={onBack} 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-50 active:scale-90 transition-all border border-stone-100"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button onClick={() => setFontSize(prev => Math.max(20, prev - 4))} className="w-11 h-11 flex items-center justify-center text-stone-700 font-bold text-base active:bg-white rounded-lg transition-colors">A-</button>
          <button onClick={() => setFontSize(prev => Math.min(60, prev + 4))} className="w-11 h-11 flex items-center justify-center text-stone-700 font-bold text-base active:bg-white rounded-lg transition-colors">A+</button>
        </div>
      </div>

      <div className="p-10 text-center bg-gradient-to-b from-stone-50 to-white border-b border-stone-50">
        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.4em] mb-4">सूरह नं. {surah.number}</p>
        <h2 className="text-3xl font-black text-stone-900 mb-1 serif-heading">{surah.englishName}</h2>
        <p className="text-emerald-600 font-bold mb-8 uppercase tracking-[0.2em] text-[10px]">{surah.englishNameTranslation}</p>
        
        <div className="flex flex-col items-center gap-4">
            <p className="arabic-text text-4xl text-emerald-950">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّहِيمِ</p>
            <div className="w-8 h-1 bg-emerald-600/20 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto divide-y divide-stone-50">
        {ayahs.map((ayah, index) => {
          const hindiText = hindi[index]?.text || '';
          const reflection = reflections[ayah.number];
          
          return (
            <div 
              key={ayah.number} 
              className={`group relative py-10 px-6 md:px-10 transition-all duration-500 ${playingId === ayah.number || speakingId === ayah.number ? 'bg-emerald-50/40' : 'hover:bg-stone-50/20'}`}
            >
              <div className="flex items-center justify-between mb-8">
                  <div className={`px-4 py-2 rounded-xl text-[12px] font-black tracking-widest ${playingId === ayah.number || speakingId === ayah.number ? 'bg-emerald-700 text-white shadow-lg' : 'bg-stone-100 text-stone-400'}`}>
                      {surah.number}:{ayah.numberInSurah}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleGenerateReflection(ayah, hindiText)}
                      className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm ${reflection ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-50'}`}
                    >
                      <span className="text-base">✨</span>
                      चिन्तन
                    </button>

                    <button 
                        onClick={() => toggleAudio(ayah.number)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            playingId === ayah.number 
                            ? 'bg-emerald-700 text-white shadow-xl shadow-emerald-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 active:scale-95'
                        }`}
                    >
                        {playingId === ayah.number ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                    </button>
                  </div>
              </div>
              
              <p 
                className="arabic-text text-right leading-[2] mb-10 text-emerald-950 font-medium" 
                style={{ fontSize: `${fontSize}px` }}
              >
                {ayah.text}
              </p>
              
              <div className={`p-6 rounded-[2rem] border transition-all duration-500 mb-6 ${speakingId === ayah.number ? 'bg-emerald-50 border-emerald-200 shadow-inner' : 'bg-stone-50/50 border-stone-100'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest px-3 py-1 bg-emerald-100/50 rounded-lg">अनुवाद (हिन्दी)</span>
                    <button 
                      onClick={() => handleSpeakHindi(hindiText, ayah.number)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold transition-all active:scale-95 shadow-sm ${speakingId === ayah.number ? 'bg-emerald-700 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      {speakingId === ayah.number ? 'सुन रहे हैं...' : 'अनुवाद सुनें'}
                    </button>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium text-lg">
                      {hindiText}
                  </p>
              </div>

              {reflection && (
                <div className={`p-8 rounded-[2rem] transition-all duration-700 animate-in slide-in-from-top-4 ${reflection.loading ? 'bg-stone-50 border border-dashed border-stone-200' : 'bg-emerald-950 border border-emerald-900 shadow-2xl'}`}>
                    {reflection.loading ? (
                        <div className="flex items-center gap-4">
                            <div className="w-6 h-6 border-2 border-emerald-100 border-t-emerald-700 rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">नूर की गहराई खोजी जा रही है...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    रूहानी चिन्तन
                                </h4>
                                <button 
                                    onClick={() => handleSpeakHindi(reflection.text, ayah.number + 10000)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${speakingId === (ayah.number + 10000) ? 'bg-emerald-500 text-white' : 'bg-white/10 text-emerald-100'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                </button>
                            </div>
                            <p className="text-emerald-50/90 leading-relaxed font-medium text-base italic">
                                {reflection.text}
                            </p>
                        </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="py-24 text-center">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"/></svg>
        </div>
        <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">सूरह पूर्ण हुई</p>
        <button 
            onClick={onBack}
            className="mt-6 px-10 py-4 bg-emerald-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-emerald-900/10"
        >
            वापस जाएँ
        </button>
      </div>
    </div>
  );
};

export default Reader;
