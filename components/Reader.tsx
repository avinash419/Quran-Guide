
import React, { useState, useEffect, useRef } from 'react';
import { Surah, Ayah } from '../types';
import { fetchSurahDetails, getAudioUrl } from '../services/quranApi';
import { speakHindi } from '../services/ttsService';

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
        const currentIndex = ayahs.findIndex(a => a.number === ayahNumber);
        if (currentIndex < ayahs.length - 1) {
          toggleAudio(ayahs[currentIndex + 1].number);
        } else {
          setPlayingId(null);
        }
      };
    }
  };

  const handleSpeakHindi = (text: string, id: number) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      audioRef.current?.pause();
      setPlayingId(null);
      setSpeakingId(id);
      speakHindi(text);
      // We can't easily detect end of speech synthesis for all browsers reliably, 
      // but we reset on click or new action.
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
            className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-50 active:scale-90 transition-all border border-stone-100"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button onClick={() => setFontSize(prev => Math.max(20, prev - 4))} className="w-9 h-9 flex items-center justify-center text-stone-700 font-bold text-sm active:bg-white rounded-lg transition-colors">A-</button>
          <button onClick={() => setFontSize(prev => Math.min(60, prev + 4))} className="w-9 h-9 flex items-center justify-center text-stone-700 font-bold text-sm active:bg-white rounded-lg transition-colors">A+</button>
        </div>
      </div>

      <div className="p-10 text-center bg-gradient-to-b from-stone-50 to-white border-b border-stone-50">
        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.4em] mb-4">सूरह नं. {surah.number}</p>
        <h2 className="text-3xl font-black text-stone-900 mb-1 serif-heading">{surah.englishName}</h2>
        <p className="text-emerald-600 font-bold mb-8 uppercase tracking-[0.2em] text-[10px]">{surah.englishNameTranslation}</p>
        
        <div className="flex flex-col items-center gap-4">
            <p className="arabic-text text-4xl text-emerald-950">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <div className="w-8 h-1 bg-emerald-600/20 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto divide-y divide-stone-50">
        {ayahs.map((ayah, index) => (
          <div 
            key={ayah.number} 
            className={`group relative py-10 px-6 md:px-10 transition-all duration-500 ${playingId === ayah.number ? 'bg-emerald-50/30' : 'hover:bg-stone-50/20'}`}
          >
            <div className="flex items-center justify-between mb-8">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${playingId === ayah.number ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-400'}`}>
                    {surah.number}:{ayah.numberInSurah}
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Share button */}
                  <button 
                    onClick={() => {
                        const shareText = `${ayah.text}\n\n"${hindi[index]?.text}"\n\n— कुरान ${surah.englishName} (${surah.number}:${ayah.numberInSurah})`;
                        navigator.share ? navigator.share({ text: shareText }) : navigator.clipboard.writeText(shareText);
                    }}
                    className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 flex items-center justify-center border border-stone-100 active:scale-90"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>

                  {/* Arabic Audio */}
                  <button 
                      onClick={() => toggleAudio(ayah.number)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          playingId === ayah.number 
                          ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 active:scale-95'
                      }`}
                  >
                      {playingId === ayah.number ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      ) : (
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
            
            <div className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest px-2 py-0.5 bg-emerald-100/50 rounded">अनुवाद (हिन्दी)</span>
                  <button 
                    onClick={() => handleSpeakHindi(hindi[index]?.text || '', ayah.number)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95 ${speakingId === ayah.number ? 'bg-emerald-700 text-white' : 'bg-white text-stone-500 border border-stone-200 shadow-sm'}`}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    {speakingId === ayah.number ? 'सुन रहे हैं...' : 'अनुवाद सुनें'}
                  </button>
                </div>
                <p className="text-stone-700 leading-relaxed font-medium text-lg">
                    {hindi[index]?.text}
                </p>
            </div>
          </div>
        ))}
      </div>

      <div className="py-24 text-center">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"/></svg>
        </div>
        <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">सूरह पूर्ण हुई</p>
        <button 
            onClick={onBack}
            className="mt-6 px-8 py-3 bg-stone-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
        >
            वापस जाएँ
        </button>
      </div>
    </div>
  );
};

export default Reader;
