import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Scale, FileCode, PenTool } from 'lucide-react';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RubricModal: React.FC<RubricModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200"
        dir="rtl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">מחוון הערכה רשמי למבחני מחשבים בכתב יד</h2>
              <p className="text-xs text-slate-400">קריטריונים ותהליך הבדיקה הממוחשב</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5">
          {/* 3 Main Criteria */}
          <div>
            <h3 className="text-sm font-semibold text-sky-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>חלוקת ציונים (מפתח 100 נקודות)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Correctness & Logic */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-300">50 נקודות</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">50%</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1.5">נכונות ולוגיקה</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  האם הקוד פותר את הבעיה ביעילות ונכונות מלאה? האם טופלו מקרי קצה מרכזיים (כגון מערך ריק, איבר יחיד, null, או תנאי עצירה ברקורסיה)?
                </p>
              </div>

              {/* Syntax & Semantics */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-300">30 נקודות</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">30%</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1.5">תחביר וסמנטיקה</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  שגיאות תחביריות או לוגיות ספציפיות לשפת התכנות (התאמת טיפוסים, החזרת ערכים, לולאות). כולל סלחנות לפסיק-נקודה semicolon הנובע מכתב יד.
                </p>
              </div>

              {/* Code Quality & Style */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-300">20 נקודות</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">20%</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1.5">איכות וסגנון קוד</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  קריאות הקוד, שמות משתנים משמעותיים, חלוקה נכונה לשלבים, אינדנטציה והימנעות מקוד מיותר או כפול.
                </p>
              </div>
            </div>
          </div>

          {/* OCR & Handwriting guidelines */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              <span>התחשבות בכתב יד ועברית (OCR & Transcription)</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-slate-100">הפרדת טקסט עברי מקוד:</strong> הערות, הסברים ופרוזה שנכתבו בעברית במחברת מופרדים באופן מוחלט מגוף הקוד ומוצגים בכרטיסייה ייעודית.
              </li>
              <li>
                <strong className="text-slate-100">סלחנות לכתב יד:</strong> המערכת מבדילה בין אותיות שנכתבו בעקמומיות או פסיק-נקודה שנשמט (אופייני למחברות בחינה) לבין שגיאה תחבירית/לוגית ממשית.
              </li>
              <li>
                <strong className="text-slate-100">מבנה הפלט הנדרש:</strong> כל דוח בדיקה מכיל: פרוטוקול תמלול, ניתוח נקודות לחיוב, טעויות וסעיפים לתיקון, התחשבות בכתב יד, פתרון מוצע ומתוקן, וציון מסכם עם משוב תומך.
              </li>
            </ul>
          </div>

          {/* Constraints */}
          <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-300 mb-0.5">מגבלת קריאות (Unreadable Photos)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                אם צילום המבחן מטושטש, חשוך או חתוך באופן שלא מאפשר פענוח מהימן, המערכת תסמן זאת מיד ותצהיר: 
                <span className="text-red-200 font-semibold mx-1">"התמונה אינה קריאה מספיק לצורך בדיקה"</span> 
                עם פירוט הסיבה והנחיות לצילום מחדש.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-sky-500/20"
          >
            הבנתי, סגור
          </button>
        </div>
      </div>
    </div>
  );
};
