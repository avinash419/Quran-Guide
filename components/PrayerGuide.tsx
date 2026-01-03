
import React from 'react';

const PrayerGuide: React.FC = () => {
  const steps = [
    {
      title: 'नियत (Niyyah)',
      description: 'नमाज़ शुरू करने से पहले अपने दिल में पक्का इरादा करें कि आप कौन सी नमाज़ (जैसे फज्र, ज़ुहर आदि) अदा कर रहे हैं।',
      icon: '🤲'
    },
    {
      title: 'तकबीर-ए-तहरीमा (Takbir)',
      description: 'अपने दोनों हाथों को कानों तक उठाएं और "अल्लाहु अकबर" कहें। अब अपने हाथों को नाभि के नीचे (या सीने पर) बांध लें।',
      icon: '🙌'
    },
    {
      title: 'कयाम और किराअत (Standing)',
      description: 'सीधे खड़े रहें और सना, सूरह फातिहा और कुरान की कोई भी एक छोटी सूरह पढ़ें।',
      icon: '🧍'
    },
    {
      title: 'रुकू (Bowing)',
      description: '"अल्लाहु अकबर" कहकर झुकें, अपने हाथों को घुटनों पर रखें और "सुब्हाना रब्बियल अज़ीम" (3 बार) कहें।',
      icon: '🙇'
    },
    {
      title: 'क़ौमा (Standing up)',
      description: '"समिअल्लाहु लिमन हमिदह" कहते हुए सीधे खड़े हो जाएं और कहें "रब्बना लकल हम्द"।',
      icon: '🆙'
    },
    {
      title: 'सजदा (Prostration)',
      description: '"अल्लाहु अकबर" कहकर माथा ज़मीन पर रखें। "सुब्हाना रब्बियल आला" (3 बार) कहें। यह दो बार करना है।',
      icon: '🧘'
    },
    {
      title: 'तशह्हुद (Sitting)',
      description: 'दो रकात के बाद या नमाज़ के आखिर में बैठें और अत्तहियात, दरूद शरीफ और दुआ-ए-मासूरा पढ़ें।',
      icon: '🧎'
    },
    {
      title: 'सलाम (Ending)',
      description: 'पहले अपने दाएं कंधे की तरफ और फिर बाएं कंधे की तरफ गर्दन घुमाकर "अस्सलामु अलैकुम व रहमतुल्लाह" कहें।',
      icon: '✨'
    }
  ];

  const prayerCounts = [
    { name: 'फज्र (Fajr)', units: '2 सुन्नत, 2 फर्ज़', time: 'भोर (सुबह होने से पहले)', icon: '🌅' },
    { name: 'ज़ुहर (Dhuhr)', units: '4 सुन्नत, 4 फर्ज़, 2 सुन्नत, 2 नफिल', time: 'दोपहर', icon: '☀️' },
    { name: 'अस्र (Asr)', units: '4 फर्ज़ (4 सुन्नत गैर मुअक्कदा)', time: 'तीसरे पहर', icon: '🌇' },
    { name: 'मग़रिब (Maghrib)', units: '3 फर्ज़, 2 सुन्नत, 2 नफिल', time: 'सूर्यास्त के तुरंत बाद', icon: '🌙' },
    { name: 'इशा (Isha)', units: '4 फर्ज़, 2 सुन्नत, 3 वितर, 2 नफिल', time: 'रात', icon: '🌌' }
  ];

  return (
    <div className="pb-12 animate-in fade-in duration-700">
      <div className="p-8 text-center bg-gradient-to-b from-stone-50 to-white border-b border-stone-100">
        <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-emerald-100/50 mb-4">
            आसान तरीका
        </div>
        <h2 className="text-3xl font-black text-stone-900 mb-2 serif-heading">नमाज़ का मुकम्मल तरीका</h2>
        <p className="text-stone-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">पांच वक्त की नमाज़ अदा करने का सरल और सही मार्गदर्शन।</p>
      </div>

      {/* Prayer Rakat Counts */}
      <section className="px-6 py-10">
        <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-8 text-center">पांच वक्त की नमाज़ें</h3>
        <div className="space-y-3">
          {prayerCounts.map((p, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-2xl shadow-inner border border-stone-100">
                    {p.icon}
                </div>
                <div className="flex-grow">
                    <h4 className="font-black text-stone-800 text-base">{p.name}</h4>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{p.time}</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        {p.units}
                    </span>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="px-6 py-6 bg-stone-50/50">
        <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-10 text-center">चरण-दर-चरण प्रक्रिया</h3>
        <div className="relative space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-emerald-100 hidden sm:block"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col sm:flex-row gap-6 group">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-900 text-white flex items-center justify-center text-2xl shadow-xl shadow-emerald-900/20 z-10 group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 w-6 h-6 rounded-full flex items-center justify-center border border-emerald-100">
                            {idx + 1}
                        </span>
                        <h4 className="font-black text-stone-900 text-lg serif-heading">{step.title}</h4>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed font-medium">
                        {step.description}
                    </p>
                </div>
            </div>
          ))}
        </div>
      </section>

      <div className="p-10 text-center">
         <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
         </div>
         <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">अल्लाह आपकी नमाज़ कुबूल फरमाए</p>
      </div>
    </div>
  );
};

export default PrayerGuide;
