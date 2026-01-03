
import React, { useState, useRef } from 'react';
import { EMOTIONS } from '../constants';
import { Emotion, GuidanceResult } from '../types';
import { getSpiritualGuidance } from '../services/geminiService';
import { speakHindi } from '../services/ttsService';
import { fetchAyahByReference, getAudioUrl } from '../services/quranApi';

const SituationGuide: React.FC = () => {
  const [selected, setSelected] = useState<Emotion | null>(null);
  const [guidance, setGuidance] = useState<GuidanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeakingTranslation, setIsSpeakingTranslation] = useState(false);
  const [isSpeakingReflection, setIsSpeakingReflection] = useState(false);
  const [isPlayingArabic, setIsPlayingArabic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelect = async (emotion: Emotion) => {
    window.speechSynthesis.cancel();
    audioRef.current?.pause();
    setIsPlayingArabic(false);
    setIsSpeakingTranslation(false);
    setIsSpeakingReflection(false);
    
    setSelected(emotion);
    setLoading(true);
    setGuidance(null);
    try {
      const result = await getSpiritualGuidance(emotion);
      setGuidance(result);
    } catch (error) {
      console.error("Guidance error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArabicPlay = async () => {
    if (!guidance) return;
    
    if (isPlayingArabic) {
      audioRef.current?.pause();
      setIsPlayingArabic(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      setIsSpeakingTranslation(false);
      setIsSpeakingReflection(false);
      setIsPlayingArabic(true);

      // Parse the reference (e.g. "Al-Baqarah 2:153")
      // Extract "2:153"
      const refMatch = guidance.reference.match(/\d+:\d+/);
      if (refMatch) {
        const ref = refMatch[0];
        const ayahData = await fetchAyahByReference(ref);
        const url = getAudioUrl(ayahData.number);
        
        audioRef.current = new Audio(url);
        audioRef.current.play();
        
        audioRef.current.onended = () => {
          setIsPlayingArabic(false);
          // Automatic Hindi translation play after Arabic
          setIsSpeakingTranslation(true);
          speakHindi(guidance.ayahHindi, () => setIsSpeakingTranslation(false));
        };
      }
    } catch (error) {
      console.error("Audio error", error);
      setIsPlayingArabic(false);
    }
  };

  const handleSpeakTranslation = () => {
    if (!guidance) return;
    if (isSpeakingTranslation) {
      window.speechSynthesis.cancel();
      setIsSpeakingTranslation(false);
    } else {
      audioRef.current?.pause();
      setIsPlayingArabic(false);
      setIsSpeakingReflection(false);
      setIsSpeakingTranslation(true);
      speakHindi(guidance.ayahHindi, () => setIsSpeakingTranslation(false));
    }
  };

  const handleSpeakReflection = () => {
    if (!guidance) return;
    if (isSpeakingReflection) {
      window.speechSynthesis.cancel();
      setIsSpeakingReflection(false);
    } else {
      audioRef.current?.pause();
      setIsPlayingArabic(false);
      setIsSpeakingTranslation(false);
      setIsSpeakingReflection(true);
      speakHindi(guidance.reflection, () => setIsSpeakingReflection(false));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-10 px-2 text-center md:text-left">
        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">रूहानी इलाज</div>
        <h2 className="text-3xl font-black text-stone-900 mb-3 tracking-tight serif-heading leading-tight">अपनी रूह का हाल बताएं</h2>
        <p className="text-stone-500 text-sm font-medium leading-relaxed max-w-sm mx-auto md:mx-0">कुरान से अपनी भावनाओं का समाधान पाएं।</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-12">
        {EMOTIONS.map((e) => (
          <button
            key={e.id}
            onClick={() => handleSelect(e.id)}
            className={`flex items-center gap-5 p-6 rounded-[2rem] transition-all duration-500 border-2 group relative overflow-hidden active:scale-95 ${
              selected === e.id 
              ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100' 
              : 'border-white bg-white hover:bg-stone-50/50 hover:border-emerald-200 shadow-sm'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 ${selected === e.id ? 'bg-emerald-600 scale-110 shadow-lg' : 'bg-stone-50 shadow-inner group-hover:scale-110'}`}>
              <span className={selected === e.id ? 'brightness-0 invert' : ''}>{e.icon}</span>
            </div>
            
            <div className="text-left flex-grow">
              <span className={`text-lg font-bold block transition-colors duration-300 ${selected === e.id ? 'text-emerald-950' : 'text-stone-700'}`}>
                {e.label}
              </span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">सुकून की तलाश</span>
            </div>

            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${selected === e.id ? 'bg-emerald-600 border-emerald-600 text-white rotate-0' : 'border-stone-100 text-stone-300 group-hover:border-emerald-200 group-hover:text-emerald-500'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center flex flex-col items-center gap-6 border border-emerald-100 animate-in zoom-in duration-300">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-700 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl animate-bounce">✨</span>
                </div>
            </div>
            <p className="text-emerald-900 font-black text-xs uppercase tracking-[0.3em]">आयत की तलाश...</p>
          </div>
        </div>
      )}

      {guidance && (
        <div className="fixed inset-0 z-[70] bg-emerald-950/40 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-20 duration-500 max-h-[90vh] overflow-y-auto">
                <button 
                  onClick={() => { window.speechSynthesis.cancel(); audioRef.current?.pause(); setGuidance(null); setSelected(null); setIsSpeakingTranslation(false); setIsSpeakingReflection(false); setIsPlayingArabic(false); }}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors z-20 active:scale-90 shadow-sm border border-stone-100"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="relative z-10 flex flex-col gap-8 pb-6">
                    <div className="space-y-6 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
                            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">आसमानी पैगाम</span>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex justify-center mb-4">
                               <button 
                                  onClick={handleArabicPlay}
                                  className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                                      isPlayingArabic 
                                      ? 'bg-emerald-700 text-white shadow-emerald-200 animate-pulse' 
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100 active:scale-90 hover:bg-emerald-100'
                                  }`}
                               >
                                  {isPlayingArabic ? (
                                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                  ) : (
                                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                  )}
                               </button>
                            </div>

                            <p className="arabic-text text-3xl md:text-4xl text-emerald-950 leading-[1.8] text-center drop-shadow-sm px-2">
                                {guidance.ayahArabic}
                            </p>
                            
                            <div className={`relative px-6 py-6 rounded-[2rem] border transition-all duration-500 ${isSpeakingTranslation ? 'bg-emerald-50 border-emerald-200 shadow-inner' : 'bg-stone-50/30 border-stone-100'}`}>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">अनुवाद</span>
                                  <button 
                                    onClick={handleSpeakTranslation}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${isSpeakingTranslation ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-700 border border-emerald-100'}`}
                                  >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                  </button>
                                </div>
                                <p className="text-lg md:text-xl text-stone-800 font-bold leading-relaxed relative z-10 italic">
                                    “{guidance.ayahHindi}”
                                </p>
                                <p className="text-[11px] text-emerald-700 font-black mt-4 uppercase tracking-widest bg-emerald-50 inline-block px-3 py-1 rounded-lg">
                                    — {guidance.reference}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-[2.5rem] p-8 border relative group overflow-hidden transition-all duration-500 ${isSpeakingReflection ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-950 border-emerald-900 shadow-2xl shadow-emerald-900/40'}`}>
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${isSpeakingReflection ? 'text-emerald-800' : 'text-emerald-100'}`}>
                            चिन्तन (Reflection)
                          </h4>
                          <button 
                            onClick={handleSpeakReflection}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-bold transition-all active:scale-95 shadow-lg ${isSpeakingReflection ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-950 shadow-emerald-950/20'}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                            {isSpeakingReflection ? 'सुन रहे हैं...' : 'चिंतन सुनें'}
                          </button>
                        </div>
                        <p className={`text-base leading-relaxed font-medium ${isSpeakingReflection ? 'text-emerald-900' : 'text-emerald-50'}`}>
                            {guidance.reflection}
                        </p>
                    </div>

                    <button 
                      onClick={() => { window.speechSynthesis.cancel(); audioRef.current?.pause(); setGuidance(null); setSelected(null); setIsSpeakingTranslation(false); setIsSpeakingReflection(false); setIsPlayingArabic(false); }}
                      className="w-full py-5 bg-emerald-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-emerald-900/30 hover:bg-emerald-800 transition-all hover:scale-[1.02] active:scale-95 border border-white/10"
                    >
                      शुक्रिया (बन्द करें)
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SituationGuide;
