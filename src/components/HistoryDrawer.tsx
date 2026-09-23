import React from 'react';
import { X, Trash2, Calendar, FileText, CheckCircle2, AlertTriangle, ArrowLeft, Download } from 'lucide-react';
import { EvaluationResult } from '../types/evaluation';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: EvaluationResult[];
  onSelectResult: (result: EvaluationResult) => void;
  onClearHistory: () => void;
  onDeleteOne: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
  onDeleteOne,
}) => {
  if (!isOpen) return null;

  const handleExportCsv = () => {
    if (history.length === 0) return;

    const headers = ['תאריך', 'כותרת מבחן', 'שם תלמיד', 'שפה', 'ציון כולל', 'נכונות ולוגיקה (50)', 'תחביר (30)', 'סגנון (20)', 'קריא'];
    const rows = history.map((item) => [
      new Date(item.timestamp).toLocaleDateString('he-IL'),
      item.examTitle || 'מבחן',
      item.studentName || 'תלמיד',
      item.detectedLanguage || 'כללי',
      item.finalEvaluation?.totalScore ?? 0,
      item.finalEvaluation?.rubric?.correctnessAndLogic?.score ?? 0,
      item.finalEvaluation?.rubric?.syntaxAndSemantics?.score ?? 0,
      item.finalEvaluation?.rubric?.codeQualityAndStyle?.score ?? 0,
      item.isReadable ? 'כן' : 'לא',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gradecode_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in" dir="rtl">
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">היסטוריית מבחנים שנבדקו</h3>
              <p className="text-xs text-slate-400">נשמר מקומית בדפדפן ({history.length} מבחנים)</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions (Export CSV / Clear) */}
          {history.length > 0 && (
            <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs px-5">
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ייצא דוח ציונים (CSV)</span>
              </button>

              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>נקה היסטוריה</span>
              </button>
            </div>
          )}

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-16 px-4">
                <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400">
                  טרם נבדקו מבחנים בסשן זה
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  כל מבחן שייבדק יופיע כאן ויישמר לשחזור וניתוח חוזר.
                </p>
              </div>
            ) : (
              history.map((item) => {
                const sc = item.finalEvaluation?.totalScore ?? 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectResult(item);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                          {item.detectedLanguage || 'קוד'}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                            sc >= 85 ? 'bg-emerald-500/20 text-emerald-300' : sc >= 70 ? 'bg-sky-500/20 text-sky-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            ציון: {sc}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteOne(item.id);
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition"
                            title="מחק מההיסטוריה"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition line-clamp-1 mb-1">
                        {item.examTitle || 'מבחן מדעי המחשב'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        נבחן/ת: {item.studentName || 'תלמיד/ה'}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{new Date(item.timestamp).toLocaleString('he-IL')}</span>
                      <span className="text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
                        פתח דוח &larr;
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
