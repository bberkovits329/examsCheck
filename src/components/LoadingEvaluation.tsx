import React, { useState, useEffect } from 'react';
import { 
  FileSearch, 
  Code2, 
  CheckCircle2, 
  BrainCircuit, 
  Sparkles, 
  PenTool,
  Scale
} from 'lucide-react';

export const LoadingEvaluation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'סריקת תמונת המבחן ו-OCR רגיש לכתב יד',
      description: 'פענוח אותיות, זיהוי שפת התכנות וסלחנות לאי-שלמויות כתיבה ידנית...',
      icon: PenTool,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
    },
    {
      title: 'הפרדת פרוזה והערות בעברית מלוגיקת הקוד',
      description: 'חילוץ הסברי התלמיד/ה בעברית ובידוד קטעי הקוד לפרוטוקול תמלול נקי...',
      icon: FileSearch,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
    },
    {
      title: 'בדיקת נכונות ולוגיקה (משקל 50%)',
      description: 'בדיקת מקרי קצה, יעילות, תנאי עצירה, שלמות האלגוריתם וטיפול בחריגות...',
      icon: BrainCircuit,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'בדיקת תחביר ואיכות קוד (30% תחביר + 20% סגנון)',
      description: 'זיהוי שגיאות שפה, שמות משתנים, אינדנטציה וניסוח פתרון מתוקן ועובד...',
      icon: Code2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'שקלול ציון סופי וניסוח משוב חינוכי תומך',
      description: 'הפקת מחוון ציונים סופי, נקודות לחיוב ומשוב מעודד לתלמיד/ה...',
      icon: Scale,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4" dir="rtl">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center">
        
        {/* Animated glowing icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 animate-spin blur-lg opacity-60" />
          <div className="relative w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center shadow-inner">
            <Sparkles className="w-8 h-8 text-sky-400 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          בודק ומנתח את מחברת המבחן...
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-8">
          המודל מבצע פענוח מולטימודלי של כתב היד, מבודד את הקוד מההערות בעברית ומעריך את הפתרון לפי מחוון מדעי המחשב.
        </p>

        {/* Steps progress */}
        <div className="space-y-3 text-right">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 ${
                  isCurrent
                    ? `${step.bgColor} ${step.borderColor} shadow-md`
                    : isCompleted
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-80'
                    : 'bg-slate-950/30 border-slate-800/40 opacity-40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isCurrent
                      ? `${step.bgColor} ${step.color} border ${step.borderColor}`
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                      {step.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-sky-400 animate-pulse px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                        מעבד כעת...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <span>מודל פענוח:</span>
          <span className="font-mono text-slate-300 text-[11px] px-2 py-0.5 rounded bg-slate-800">
            gemini-3.8-flash (Multimodal Vision)
          </span>
        </div>

      </div>
    </div>
  );
};
