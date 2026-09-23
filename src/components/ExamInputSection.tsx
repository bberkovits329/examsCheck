import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  FileText, 
  Trash2, 
  Plus, 
  HelpCircle,
  Eye,
  Sliders,
  AlertTriangle,
  ClipboardPaste,
  BookOpen
} from 'lucide-react';
import { SAMPLE_EXAMS, ExamSample } from '../data/samples';
import { readFileAsBase64, svgToPngBase64 } from '../utils/imageUtils';
import { CameraCaptureModal } from './CameraCaptureModal';

export interface ImageAttachment {
  id: string;
  data: string; // base64 without prefix or with prefix
  mimeType: string;
  name: string;
  previewUrl: string;
}

interface ExamInputSectionProps {
  onEvaluate: (data: {
    images: ImageAttachment[];
    targetLanguage: string;
    questionPrompt: string;
    teacherNotes: string;
    studentName: string;
    examTitle: string;
  }) => void;
  isLoading: boolean;
  onOpenCamera?: () => void;
}

export const ExamInputSection: React.FC<ExamInputSectionProps> = ({
  onEvaluate,
  isLoading,
}) => {
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [targetLanguage, setTargetLanguage] = useState<string>('auto');
  const [questionPrompt, setQuestionPrompt] = useState<string>('');
  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [examTitle, setExamTitle] = useState<string>('מבחן במדעי המחשב');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clipboard paste listener to paste images directly
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const base64Info = await readFileAsBase64(file);
            const newAttachment: ImageAttachment = {
              id: 'pasted-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
              data: base64Info.data,
              mimeType: base64Info.mimeType,
              name: 'תמונה שהודבקה מהלוח (' + new Date().toLocaleTimeString('he-IL') + ')',
              previewUrl: `data:${base64Info.mimeType};base64,${base64Info.data}`,
            };
            setImages((prev) => [...prev, newAttachment]);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle file uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ImageAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const info = await readFileAsBase64(file);
        newAttachments.push({
          id: 'upload-' + Date.now() + '-' + i,
          data: info.data,
          mimeType: info.mimeType,
          name: info.name,
          previewUrl: `data:${info.mimeType};base64,${info.data}`,
        });
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }

    setImages((prev) => [...prev, ...newAttachments]);
    setSelectedSampleId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Select preloaded sample exam
  const handleSelectSample = async (sample: ExamSample) => {
    setSelectedSampleId(sample.id);
    setExamTitle(sample.title);
    setQuestionPrompt(sample.questionPrompt);
    setTargetLanguage(sample.language.toLowerCase());

    try {
      // Render SVG to standard PNG/JPEG base64 for vision OCR
      const rendered = await svgToPngBase64(sample.svgContent, 850, 1100);
      const sampleAttachment: ImageAttachment = {
        id: sample.id,
        data: rendered.data,
        mimeType: rendered.mimeType,
        name: `${sample.title} (${sample.language})`,
        previewUrl: `data:${rendered.mimeType};base64,${rendered.data}`,
      };
      setImages([sampleAttachment]);
    } catch (err) {
      console.error('Error rendering sample SVG:', err);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedSampleId === id) {
      setSelectedSampleId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;

    onEvaluate({
      images,
      targetLanguage,
      questionPrompt,
      teacherNotes,
      studentName: studentName.trim() || 'תלמיד/ה',
      examTitle: examTitle.trim() || 'מבחן מדעי המחשב',
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8" dir="rtl">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>סריקה ופענוח כתב יד מתקדמים במדעי המחשב</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
            הערכה ובדיקה אוטומטית למבחני קוד בכתב יד
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
            העלה צילום של מחברת בחינה בעברית עם קוד (פייתון, ג׳אווה, C++, C# או JS). המערכת תבצע OCR מותאם לכתב יד, תבודד הערות בעברית מלוגיקת הקוד, תחשב ציון לפי מחוון (50% לוגיקה, 30% תחביר, 20% סגנון), ותפיק פתרון מתוקן ומשוב פדגוגי.
          </p>

          {/* Quick preset samples */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>בחר מבחן מובנה לדוגמה לבדיקה מיידית:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SAMPLE_EXAMS.map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`text-right p-3 rounded-2xl border transition-all duration-200 group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400/60 shadow-md shadow-sky-500/10'
                        : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sample.language === 'Python' 
                            ? 'bg-amber-500/20 text-amber-300' 
                            : sample.language === 'Java'
                            ? 'bg-red-500/20 text-red-300'
                            : sample.language === 'C++'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {sample.language}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {sample.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition line-clamp-1 mb-1">
                        {sample.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {sample.subtitle}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>טווח ציון: {sample.expectedScoreRange}</span>
                      <span className="text-sky-400 font-medium">טען &gt;</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Upload / Exam Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Upload Zone */}
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            תמונות מחברת הבחינה (דף יחיד או מספר דפים)
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-slate-700 hover:border-sky-400/80 rounded-3xl p-8 text-center bg-slate-950/40 hover:bg-slate-950/80 transition cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">
                  גרור לכאן תמונות של מחברת המבחן, או <span className="text-sky-400 underline underline-offset-4">לחץ לבחירת קבצים</span>
                </p>
                <p className="text-xs text-slate-400">
                  תומך ב-JPG, PNG, WebP • ניתן גם להדביק ישירות עם <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Ctrl+V</kbd>
                </p>
              </div>

              {/* Action buttons inside upload zone */}
              <div className="flex items-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setIsCameraActive(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition shadow"
                >
                  <Camera className="w-4 h-4 text-sky-400" />
                  <span>צלם במצלמה עכשיו</span>
                </button>
              </div>
            </div>
          </div>

          {/* Uploaded Images Thumbnails */}
          {images.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>תמונות מוכנות לבדיקה ({images.length}):</span>
                <button
                  type="button"
                  onClick={() => setImages([])}
                  className="text-red-400 hover:text-red-300 hover:underline"
                >
                  הסר את כל התמונות
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[3/4] shadow-md"
                  >
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-90 group-hover:opacity-100 transition p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white border border-slate-700">
                          עמוד {idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setActivePreviewImage(img.previewUrl)}
                            className="p-1 rounded-lg bg-black/60 hover:bg-black/90 text-white transition"
                            title="הגדל תמונה"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="p-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition"
                            title="מחק עמוד"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-white truncate text-right">
                        {img.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exam Information & Target Language */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Target Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              שפת התכנות
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="auto">זיהוי אוטומטי מתוך כתב היד</option>
              <option value="python">Python (פייתון)</option>
              <option value="java">Java (ג׳אווה)</option>
              <option value="cpp">C++ (סי פלוס פלוס)</option>
              <option value="csharp">C# (סי שארפ)</option>
              <option value="javascript">JavaScript / TypeScript</option>
            </select>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              שם התלמיד/ה (אופציונלי לדוח)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="למשל: דניאל כהן"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Exam Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              כותרת המבחן / שאלון
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="למשל: מתכונת בגרות - מדעי המחשב"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Toggle Advanced Question Prompt & Rubric Notes */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'הסתר הגדרות שאלון והנחיות מורה' : 'הוסף נוסח שאלה / דגשים מיוחדים לבדיקה'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  נוסח השאלה / משימה כפי שניתנה בבחינה:
                </label>
                <textarea
                  rows={2}
                  value={questionPrompt}
                  onChange={(e) => setQuestionPrompt(e.target.value)}
                  placeholder="למשל: כתוב פעולה רקורסיבית המקבלת מערך ומספר ומחזירה..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  הנחיות או דגשים מיוחדים של המורה לבודק:
                </label>
                <input
                  type="text"
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="למשל: לא להוריד ניקוד על שמות משתנים, אך להקפיד על סיבוכיות O(log n)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>מוכן להערכה מדויקת לפי מפתח 100</span>
          </div>

          <button
            type="submit"
            disabled={images.length === 0 || isLoading}
            className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-500 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-sky-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Sparkles className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
            <span>התחל בבדיקת המבחן והערכת הקוד</span>
          </button>
        </div>

      </form>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraActive}
        onClose={() => setIsCameraActive(false)}
        onCapture={(photoDataUrl) => {
          const mimeType = 'image/jpeg';
          const base64Data = photoDataUrl.includes(',') ? photoDataUrl.split(',')[1] : photoDataUrl;
          const newAttachment: ImageAttachment = {
            id: 'camera-' + Date.now(),
            data: base64Data,
            mimeType,
            name: 'צילום מצלמה (' + new Date().toLocaleTimeString('he-IL') + ')',
            previewUrl: photoDataUrl,
          };
          setImages((prev) => [...prev, newAttachment]);
          setSelectedSampleId(null);
        }}
      />

      {/* Image Preview Modal */}
      {activePreviewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActivePreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-950 border border-slate-700 p-2" onClick={(e) => e.stopPropagation()}>
            <img 
              src={activePreviewImage} 
              alt="תצוגה מקדימה מוגדלת" 
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
            <button
              onClick={() => setActivePreviewImage(null)}
              className="absolute top-4 left-4 p-2 bg-slate-900/90 text-white rounded-full hover:bg-slate-800 border border-slate-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
