import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  Printer, 
  FileCode2, 
  Lightbulb, 
  BookOpen, 
  Columns, 
  Share2, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Code,
  PenTool,
  MessageSquare
} from 'lucide-react';
import { EvaluationResult } from '../types/evaluation';

interface EvaluationDashboardProps {
  result: EvaluationResult;
  onNewEvaluation: () => void;
  originalImages?: string[];
}

export const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({
  result,
  onNewEvaluation,
  originalImages = [],
}) => {
  const [activeTab, setActiveTab] = useState<'transcription' | 'analysis' | 'solution' | 'diff' | 'raw' | 'inspector'>('transcription');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // If image is unreadable
  if (!result.isReadable) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4" dir="rtl">
        <div className="bg-red-950/40 border-2 border-red-500/50 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-red-200 tracking-tight mb-2">
              התמונה אינה קריאה מספיק לצורך בדיקה
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {result.unreadableReason || 'הצילום מטושטש, חשוך מדי, או שחלקים מהקוד חתוכים בשוליים ולא ניתן להבטיח הערכה הוגנת ומדויקת.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right max-w-md mx-auto space-y-2">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>המלצות לצילום תקין של מחברת הבחינה:</span>
            </h4>
            <ul className="text-xs text-slate-300 list-disc list-inside space-y-1.5 leading-relaxed">
              <li>צלם מזווית ישרה (ממעוף הציפור) ישירות מעל הדף.</li>
              <li>ודא תאורה מספקת וללא צל הנופל על שורות הקוד.</li>
              <li>כלול את כל שולי הדף (הימנע מחיתוך שורות פקודה או סוגריים מסולסלים).</li>
              <li>במידה והכתב בהיר מאוד, השתמש בעט שחור או כחול כהה.</li>
            </ul>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={onNewEvaluation}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 transition"
            >
              העלה צילום חדש וברור
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { finalEvaluation, analysis, transcribedCode, hebrewNotes, correctedCode } = result;
  const score = finalEvaluation.totalScore ?? 85;

  // Grade color scheme
  const getScoreBadge = (sc: number) => {
    if (sc >= 90) return { label: 'מצוין', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', bar: 'bg-emerald-500' };
    if (sc >= 80) return { label: 'טוב מאוד', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40', bar: 'bg-sky-500' };
    if (sc >= 70) return { label: 'כמעט טוב', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', bar: 'bg-indigo-500' };
    if (sc >= 55) return { label: 'מספיק', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', bar: 'bg-amber-500' };
    return { label: 'טעון שיפור', bg: 'bg-red-500/20 text-red-300 border-red-500/40', bar: 'bg-red-500' };
  };

  const scoreBadge = getScoreBadge(score);

  // Copy code helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy full Hebrew markdown report formatted as requested
  const handleCopyFullReport = () => {
    let reportText = result.rawOutputHebrew || '';
    if (!reportText) {
      reportText = `פרוטוקול תמלול הקוד:
\`\`\`${result.detectedLanguage || ''}
${transcribedCode}
\`\`\`

ניתוח והערכה:
נקודות לחיוב:
${analysis.positivePoints?.map((p) => `- ${p}`).join('\n') || ''}

טעויות וסעיפים לתיקון:
${analysis.errorsAndFixes?.map((e) => `- ${e.title}: ${e.description}`).join('\n') || ''}

התחשבות בכתב יד:
${analysis.handwritingConsiderations || ''}

פתרון מוצע/מתוקן:
\`\`\`${result.detectedLanguage || ''}
${correctedCode.code}
\`\`\`

ציון סופי ומשוב:
ציון סופי: ${score}/100
${finalEvaluation.studentSummaryFeedback || ''}`;
    }

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16" dir="rtl">
      
      {/* Top Header Card with Score & Actions */}
      <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Student & Exam Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.8 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                {result.detectedLanguage || 'מדעי המחשב'}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.8 rounded-full border ${scoreBadge.bg}`}>
                {scoreBadge.label}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(result.timestamp).toLocaleDateString('he-IL')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {result.examTitle || 'דוח הערכת מבחן בכתב יד'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              נבחן/ת: <strong className="text-white">{result.studentName || 'תלמיד/ה'}</strong> • בדיקה ממוחשבת מבוססת מחוון
            </p>
          </div>

          {/* Score Display Card */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shadow-inner">
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">ציון סופי מחושב</span>
              <div className="flex items-baseline gap-1 justify-center">
                <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                  {score}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ 100</span>
              </div>
            </div>
            
            <div className="h-12 w-px bg-slate-800" />

            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleCopyFullReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition"
                title="העתק דוח מלא בעברית למערכת הציונים (משו״ב / קלאסרום)"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? 'הדוח הועתק!' : 'העתק דוח להערכה'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="הדפס או שמור כ-PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>הדפס גיליון ציונים</span>
              </button>
            </div>
          </div>

        </div>

        {/* 3 Rubric Breakdown Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-800">
          
          {/* Correctness & Logic (50%) */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-300">נכונות ולוגיקה (50%)</span>
              <span className="text-xs font-mono font-bold text-white">
                {finalEvaluation.rubric?.correctnessAndLogic?.score ?? 40} / {finalEvaluation.rubric?.correctnessAndLogic?.maxScore ?? 50}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((finalEvaluation.rubric?.correctnessAndLogic?.score ?? 40) / 50) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              {finalEvaluation.rubric?.correctnessAndLogic?.notes || 'הערכה על יעילות האלגוריתם, שלמות הלוגיקה וטיפול במקרי קצה.'}
            </p>
          </div>

          {/* Syntax & Semantics (30%) */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-cyan-300">תחביר וסמנטיקה (30%)</span>
              <span className="text-xs font-mono font-bold text-white">
                {finalEvaluation.rubric?.syntaxAndSemantics?.score ?? 25} / {finalEvaluation.rubric?.syntaxAndSemantics?.maxScore ?? 30}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((finalEvaluation.rubric?.syntaxAndSemantics?.score ?? 25) / 30) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              {finalEvaluation.rubric?.syntaxAndSemantics?.notes || 'בדיקת תחביר שפה ספציפי תוך סלחנות לפסיק-נקודה וכתב יד.'}
            </p>
          </div>

          {/* Code Quality & Style (20%) */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-300">איכות וסגנון קוד (20%)</span>
              <span className="text-xs font-mono font-bold text-white">
                {finalEvaluation.rubric?.codeQualityAndStyle?.score ?? 17} / {finalEvaluation.rubric?.codeQualityAndStyle?.maxScore ?? 20}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((finalEvaluation.rubric?.codeQualityAndStyle?.score ?? 17) / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              {finalEvaluation.rubric?.codeQualityAndStyle?.notes || 'קריאות, מתן שמות משתנים משמעותיים, ומבנה מסודר.'}
            </p>
          </div>

        </div>

        {/* Student Feedback Callout */}
        {finalEvaluation.studentSummaryFeedback && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900 border border-sky-500/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-sky-300 mb-0.5">משוב מסכם ומעודד לתלמיד/ה</h4>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {finalEvaluation.studentSummaryFeedback}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('transcription')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'transcription'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          <span>פרוטוקול תמלול הקוד</span>
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'analysis'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>ניתוח והערכה מפורטת</span>
          {analysis.errorsAndFixes?.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'analysis' ? 'bg-slate-950 text-white' : 'bg-red-500/20 text-red-400'
            }`}>
              {analysis.errorsAndFixes.length} הערות
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('solution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'solution'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>פתרון מוצע ומתוקן</span>
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'diff'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Columns className="w-4 h-4" />
          <span>השוואת קוד (מקור מול מתוקן)</span>
        </button>

        {originalImages.length > 0 && (
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'inspector'
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>השוואה למחברת המקורית</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('raw')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'raw'
              ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>פלט מובנה מלא (טקסט)</span>
        </button>
      </div>

      {/* Tab Content 1: Transcribed Code */}
      {activeTab === 'transcription' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">פרוטוקול תמלול הקוד מתוך כתב היד</span>
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 font-mono">
                  {result.detectedLanguage}
                </span>
              </div>
              <button
                onClick={() => handleCopyCode(transcribedCode)}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'הקוד הועתק!' : 'העתק קוד'}</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-slate-950 overflow-x-auto text-left" dir="ltr">
              <pre className="font-mono text-sm leading-relaxed text-sky-100 whitespace-pre">
                {transcribedCode || '// לא נמצא קוד'}
              </pre>
            </div>
          </div>

          {/* Hebrew Prose / Notes extracted from the exam sheet */}
          {hebrewNotes && hebrewNotes.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                <span>הערות, הסברים ופרוזה בעברית שנכתבו במחברת (הופרדו מהקוד)</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                לפי הנחיות המערכת, כל הסבר מילולי בעברית מופרד מלוגיקת הקוד כדי לשמור על תקינות הקוד וקריאותו:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {hebrewNotes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Detailed Analysis */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          
          {/* Positive Points (נקודות לחיוב) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5" />
              <span>נקודות לחיוב - מה התלמיד/ה ביצעו היטב:</span>
            </h3>

            <div className="space-y-2.5">
              {analysis.positivePoints?.map((point, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Errors & Corrections (טעויות וסעיפים לתיקון) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>טעויות וסעיפים לתיקון (צעד-אחר-צעד):</span>
              </h3>
              <span className="text-xs text-slate-400">
                סה״כ {analysis.errorsAndFixes?.length || 0} סעיפים
              </span>
            </div>

            {(!analysis.errorsAndFixes || analysis.errorsAndFixes.length === 0) ? (
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-emerald-300">
                  לא נמצאו שגיאות או באגים מהותיים! הפתרון תקין ונכון.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {analysis.errorsAndFixes.map((err, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      err.severity === 'critical'
                        ? 'bg-red-950/30 border-red-500/40'
                        : err.severity === 'moderate'
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          err.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : err.severity === 'moderate'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {err.severity === 'critical' ? 'שגיאה קריטית' : err.severity === 'moderate' ? 'שגיאה בינונית' : 'הערת סגנון/קלה'}
                        </span>
                        <h4 className="text-xs font-bold text-white">
                          {err.title}
                        </h4>
                      </div>

                      {err.lineNumber && (
                        <span className="text-[11px] font-mono text-slate-400">
                          שורה {err.lineNumber}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {err.description}
                    </p>

                    {err.suggestedCorrection && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                        <span className="text-[11px] font-bold text-sky-400 block mb-1">
                          התיקון המומלץ:
                        </span>
                        <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                          {err.suggestedCorrection}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Handwriting Considerations (התחשבות בכתב יד) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
              <PenTool className="w-5 h-5" />
              <span>התחשבות בכתב יד ועמימות כתיבה ידנית:</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {analysis.handwritingConsiderations || 'הקוד בכתב היד היה קריא ברובו. הופגנה סלחנות לשגיאות כתב יד קלות (כגון חוסר בפסיק-נקודה semicolon או אי-שלמות באותיות) בהתאם למחוון הרשמי.'}
            </p>
          </div>

        </div>
      )}

      {/* Tab Content 3: Corrected Code Solution */}
      {activeTab === 'solution' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">פתרון מוצע ומתוקן (עובד ונקי)</span>
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 font-mono">
                  {result.detectedLanguage}
                </span>
              </div>
              <button
                onClick={() => handleCopyCode(correctedCode.code)}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'הועתק!' : 'העתק פתרון מתוקן'}</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-slate-950 overflow-x-auto text-left" dir="ltr">
              <pre className="font-mono text-sm leading-relaxed text-emerald-200 whitespace-pre">
                {correctedCode.code || '// לא נוצר פתרון'}
              </pre>
            </div>

            {correctedCode.explanation && (
              <div className="p-4 bg-slate-900/90 border-t border-slate-800">
                <span className="text-xs font-bold text-sky-400 block mb-1">הסבר על התיקונים שבוצעו:</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {correctedCode.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 4: Code Diff Comparison */}
      {activeTab === 'diff' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-300 flex items-center justify-between">
            <span>השוואה מקבילה בין קוד התלמיד המקורי (שמאל) לבין הפתרון המתוקן (ימין):</span>
            <span className="text-[10px] text-sky-400 font-mono">Side-by-Side Comparison</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Student's Original Transcribed Code */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">קוד התלמיד/ה (מתוך כתב היד)</span>
                <span className="text-[10px] text-slate-400 font-mono">מקור</span>
              </div>
              <div className="p-4 bg-slate-950 overflow-x-auto text-left h-[420px]" dir="ltr">
                <pre className="font-mono text-xs text-amber-100/90 leading-relaxed whitespace-pre">
                  {transcribedCode}
                </pre>
              </div>
            </div>

            {/* Corrected Code */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">הפתרון המוצע והמתוקן</span>
                <span className="text-[10px] text-slate-400 font-mono">מתוקן</span>
              </div>
              <div className="p-4 bg-slate-950 overflow-x-auto text-left h-[420px]" dir="ltr">
                <pre className="font-mono text-xs text-emerald-100/90 leading-relaxed whitespace-pre">
                  {correctedCode.code}
                </pre>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content 5: Visual Exam Inspector (Notebook image alongside findings) */}
      {activeTab === 'inspector' && originalImages.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Original Handwritten Image */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
              <span className="font-bold text-sky-400">צילום מחברת הבחינה המקורית</span>
              <span className="text-[10px] text-slate-500">דף בחינה</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black max-h-[650px] overflow-y-auto">
              <img
                src={originalImages[0]}
                alt="מחברת בחינה מקורית"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Quick Findings & Transcribed Code */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>ממצאים עיקריים שפוענחו מהדף:</span>
              </h3>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">ציון כולל:</span>
                  <span className="font-bold text-white text-base">{score} / 100</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">שפה:</span>
                  <span className="text-sky-300 font-mono">{result.detectedLanguage}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">שגיאות שאותרו:</span>
                  <span className="text-red-400 font-bold">{analysis.errorsAndFixes?.length || 0}</span>
                </div>
              </div>

              {/* Transcribed code preview */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300">תמלול הקוד מכתב היד:</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left max-h-[300px] overflow-y-auto" dir="ltr">
                  <pre className="font-mono text-xs text-slate-200 whitespace-pre">
                    {transcribedCode}
                  </pre>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab Content 6: Full Verbatim Markdown Output */}
      {activeTab === 'raw' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white">פלט מובנה מלא בעברית לפי המבנה הנדרש</span>
            </div>
            <button
              onClick={handleCopyFullReport}
              className="flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg text-xs font-semibold border border-sky-500/30 transition"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'הועתק!' : 'העתק פלט שלם'}</span>
            </button>
          </div>

          <div className="p-6 bg-slate-950 text-right leading-relaxed text-xs text-slate-200 font-mono whitespace-pre-wrap">
            {result.rawOutputHebrew || `פרוטוגל תמלול הקוד:
\`\`\`${result.detectedLanguage}
${transcribedCode}
\`\`\`

ניתוח והערכה:
נקודות לחיוב:
${analysis.positivePoints?.map((p) => `- ${p}`).join('\n')}

טעויות וסעיפים לתיקון:
${analysis.errorsAndFixes?.map((e) => `- ${e.title}: ${e.description}`).join('\n')}

התחשבות בכתב יד:
${analysis.handwritingConsiderations}

פתרון מוצע/מתוקן:
\`\`\`${result.detectedLanguage}
${correctedCode.code}
\`\`\`

ציון סופי ומשוב:
ציון סופי: ${score}/100
${finalEvaluation.studentSummaryFeedback}`}
          </div>
        </div>
      )}

    </div>
  );
};
