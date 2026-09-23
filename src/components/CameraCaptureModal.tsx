import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhoto(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('לא ניתן לגשת למצלמה. אנא ודא שהענקת הרשאות מצלמה בדפדפן או השתמש בהעלאת קובץ.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedPhoto(dataUrl);
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col text-slate-100"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-white text-base">צילום מחברת הבחינה במצלמה</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Snapshot view */}
        <div className="relative bg-black aspect-[4/3] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-sm">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <p className="text-sm text-slate-300 mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                נסה שוב
              </button>
            </div>
          ) : capturedPhoto ? (
            <img 
              src={capturedPhoto} 
              alt="צילום מבחן" 
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Exam alignment guide box */}
              <div className="absolute inset-8 border-2 border-dashed border-sky-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <span className="text-[11px] font-medium bg-black/60 text-sky-300 px-2 py-0.5 rounded self-start">
                  כוון את דף המבחן לתוך המסגרת
                </span>
                <span className="text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded self-end">
                  ודא תאורה טובה וללא צללים כבדים
                </span>
              </div>
            </>
          )}
        </div>

        {/* Controls footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {!capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={toggleFacingMode}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>החלף מצלמה</span>
              </button>

              <button
                type="button"
                onClick={takeSnapshot}
                disabled={Boolean(cameraError)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 transition disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>צלם דף</span>
              </button>

              <div className="w-20" />
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={retakePhoto}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>צלם שוב</span>
              </button>

              <button
                type="button"
                onClick={confirmPhoto}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition"
              >
                <Check className="w-4 h-4" />
                <span>השתמש בתמונה זו</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
