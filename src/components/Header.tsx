import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  History, 
  Sparkles, 
  FileText,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  onOpenRubric: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  hasResult: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRubric,
  onOpenHistory,
  onReset,
  hasResult,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>GradeCode</span>
                <span className="text-sky-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-400/20">IL</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                בדיקה אוטומטית למבחני כתב יד
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              מערכת מומחית להערכת מבחני מדעי המחשב בעברית • בגרות ואקדמיה
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenRubric}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
            title="קריטריוני הערכה ומחוון ציונים"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline">מחוון ציונים (50/30/20)</span>
            <span className="md:hidden">מחוון</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
            title="היסטוריית מבחנים שנבדקו"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span>היסטוריה</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                {historyCount}
              </span>
            )}
          </button>

          {hasResult && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
              title="בדיקת מבחן חדש"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>מבחן חדש</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
