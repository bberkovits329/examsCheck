import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExamInputSection, ImageAttachment } from './components/ExamInputSection';
import { LoadingEvaluation } from './components/LoadingEvaluation';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { RubricModal } from './components/RubricModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { EvaluationResult } from './types/evaluation';
import { AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'gradecode_il_eval_history_v1';

export default function App() {
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<EvaluationResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Handle evaluation submission
  const handleEvaluate = async (data: {
    images: ImageAttachment[];
    targetLanguage: string;
    questionPrompt: string;
    teacherNotes: string;
    studentName: string;
    examTitle: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentImages(data.images.map((img) => img.previewUrl));

    try {
      const payload = {
        images: data.images.map((img) => ({
          data: img.data,
          mimeType: img.mimeType,
          name: img.name,
        })),
        targetLanguage: data.targetLanguage,
        questionPrompt: data.questionPrompt,
        teacherNotes: data.teacherNotes,
        studentName: data.studentName,
        examTitle: data.examTitle,
      };

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || 'שגיאה בבדיקת המבחן. אנא נסה שוב.');
      }

      const resObj: EvaluationResult = {
        id: 'eval-' + Date.now(),
        timestamp: Date.now(),
        examTitle: data.examTitle,
        studentName: data.studentName,
        isReadable: responseData.data.isReadable ?? true,
        unreadableReason: responseData.data.unreadableReason || '',
        detectedLanguage: responseData.data.detectedLanguage || data.targetLanguage || 'כללי',
        transcribedCode: responseData.data.transcribedCode || '',
        hebrewNotes: responseData.data.hebrewNotes || [],
        analysis: responseData.data.analysis || {
          positivePoints: [],
          errorsAndFixes: [],
          handwritingConsiderations: '',
        },
        correctedCode: responseData.data.correctedCode || {
          code: '',
          language: data.targetLanguage,
          explanation: '',
        },
        finalEvaluation: responseData.data.finalEvaluation || {
          totalScore: 85,
          rubric: {
            correctnessAndLogic: { score: 42, maxScore: 50, notes: '' },
            syntaxAndSemantics: { score: 26, maxScore: 30, notes: '' },
            codeQualityAndStyle: { score: 17, maxScore: 20, notes: '' },
          },
          studentSummaryFeedback: '',
        },
        rawOutputHebrew: responseData.data.rawOutputHebrew || '',
        imagesPreview: data.images.map((img) => img.previewUrl),
      };

      setCurrentResult(resObj);
      setHistory((prev) => [resObj, ...prev.slice(0, 49)]); // keep last 50
    } catch (err: any) {
      console.error('Evaluation failed:', err);
      setErrorMessage(err.message || 'ארעה שגיאה בבדיקת המבחן');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (item: EvaluationResult) => {
    setCurrentResult(item);
    setCurrentImages(item.imagesPreview || []);
    setErrorMessage(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setCurrentResult(null);
    setCurrentImages([]);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Assistant',sans-serif]" dir="rtl">
      
      {/* Navigation Header */}
      <Header
        onOpenRubric={() => setIsRubricOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        hasResult={Boolean(currentResult)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error notification banner */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-red-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-xs font-semibold">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-400 hover:text-white px-2 py-1 rounded bg-red-500/10"
            >
              סגור
            </button>
          </div>
        )}

        {/* Dynamic Display based on state */}
        {isLoading ? (
          <LoadingEvaluation />
        ) : currentResult ? (
          <EvaluationDashboard
            result={currentResult}
            onNewEvaluation={handleReset}
            originalImages={currentImages}
          />
        ) : (
          <ExamInputSection
            onEvaluate={handleEvaluate}
            isLoading={isLoading}
          />
        )}

      </main>

      {/* Global Modals */}
      <RubricModal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={handleSelectFromHistory}
        onClearHistory={handleClearHistory}
        onDeleteOne={handleDeleteHistoryItem}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            GradeCode IL • מערכת מומחית להערכה ובדיקה אוטומטית של מבחני מדעי המחשב בכתב יד
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>מחוון רשמי (50% / 30% / 20%)</span>
            <span>•</span>
            <span>Gemini Vision Multimodal OCR</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
