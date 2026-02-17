import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Image as ImageIcon, Video, Radio, Users, ChevronLeft, ChevronRight, Send, Music, Zap, Settings, RefreshCw, Layers, Check, Share2, Smile, MapPin, Trash2, Sun, Moon, Sparkles } from 'lucide-react';

interface CreateTabProps {
  onCancel: () => void;
  initialMode?: 'post' | 'live' | 'selection';
}

const CreateTab: React.FC<CreateTabProps> = ({ onCancel, initialMode = 'post' }) => {
  const [mode, setMode] = useState<'selection' | 'post' | 'live' | 'edit'>(initialMode);
  const [cameraMode, setCameraMode] = useState<'LIVE' | 'CREATE' | 'NORMAL' | 'BOOMERANG'>('NORMAL');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [flash, setFlash] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (mode === 'post' || mode === 'live') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
        setCapturedMedia([...capturedMedia, { url: canvas.toDataURL('image/jpeg'), type: 'image' }]);
        setMode('edit');
      }
    }
  };

  const renderCameraUI = () => (
    <div className="fixed inset-0 bg-black flex flex-col text-white animate-in fade-in duration-300">
      {/* Full Screen Video Background */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-0" 
      />

      {/* Top Bar - Transparent Overlay */}
      <header className="p-6 pt-12 flex items-center justify-between z-50 bg-gradient-to-b from-black/50 to-transparent">
        <button className="p-2 text-white drop-shadow-md active:scale-90 transition-transform">
          <Settings className="w-6 h-6" />
        </button>
        <button onClick={() => setFlash(!flash)} className="p-2 text-white drop-shadow-md active:scale-90 transition-transform">
          <Zap className={`w-6 h-6 ${flash ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </button>
        <button onClick={onCancel} className="p-2 text-white drop-shadow-md active:scale-90 transition-transform">
          <X className="w-7 h-7" />
        </button>
      </header>

      {/* Side Tools - Overlay */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col space-y-8 z-20">
         <button className="text-white drop-shadow-lg active:scale-90 transition-transform"><Smile className="w-6 h-6" /></button>
         <button className="text-white drop-shadow-lg active:scale-90 transition-transform"><Layers className="w-6 h-6" /></button>
         <button className="text-white drop-shadow-lg active:scale-90 transition-transform"><Music className="w-6 h-6" /></button>
      </div>

      <div className="flex-grow pointer-events-none" />

      {/* Bottom Controls - Overlay */}
      <footer className="pb-12 flex flex-col items-center justify-center space-y-8 relative z-30 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center space-x-10">
          {/* Gallery Preview */}
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 overflow-hidden cursor-pointer active:scale-90 transition-transform shadow-xl">
             <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
             </div>
          </div>

          {/* Capture Button Stack */}
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500/60 to-pink-500/60 backdrop-blur-sm border border-white/10 shadow-lg" />
            <button 
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-[6px] border-white p-1 transition-all active:scale-90 shadow-2xl"
            >
              <div className="w-full h-full rounded-full bg-white shadow-inner" />
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400/60 to-cyan-400/60 backdrop-blur-sm border border-white/10 shadow-lg" />
          </div>

          {/* Switch Camera */}
          <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 active:rotate-180 transition-transform shadow-xl">
            <RefreshCw className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide px-20">
          {['LIVE', 'CREATE', 'NORMAL', 'BOOMERANG'].map(m => (
            <button 
              key={m}
              onClick={() => setCameraMode(m as any)}
              className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all flex-shrink-0 drop-shadow-lg ${cameraMode === m ? 'text-white scale-110' : 'text-white/40'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );

  const renderEdit = () => (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col text-white animate-in slide-in-from-right duration-500">
      <header className="absolute top-0 left-0 right-0 p-6 pt-12 flex items-center justify-between z-50 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={() => setMode('post')} className="p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/10 active:scale-90 transition-transform shadow-lg">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-6">
          <button className="text-white drop-shadow-md"><Music className="w-6 h-6" /></button>
          <button className="text-white drop-shadow-md"><Sparkles className="w-6 h-6" /></button>
          <button className="text-white drop-shadow-md"><ImageIcon className="w-6 h-6" /></button>
        </div>
      </header>

      {/* Full Screen Image Preview */}
      <div className="absolute inset-0 z-0">
        <img src={capturedMedia[capturedMedia.length - 1]?.url} className="w-full h-full object-cover" alt="Post preview" />
      </div>

      <div className="flex-grow pointer-events-none" />

      <footer className="p-8 pb-12 flex items-center justify-between z-50 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex space-x-4">
          <div className="flex flex-col items-center space-y-1 group cursor-pointer">
            <div className="w-14 h-14 rounded-full border-2 border-white/40 p-0.5 shadow-xl transition-transform group-active:scale-95">
              <img src="https://picsum.photos/seed/me/100/100" className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest drop-shadow-md">Your story</span>
          </div>
          <div className="flex flex-col items-center space-y-1 group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center shadow-xl transition-transform group-active:scale-95">
              <Users className="w-6 h-6 text-white/80" />
            </div>
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest drop-shadow-md">Friends</span>
          </div>
        </div>

        <button 
          onClick={onCancel}
          className="bg-white text-black px-10 py-4 rounded-full font-black text-xs tracking-[0.2em] flex items-center space-x-2 shadow-2xl active:scale-95 transition-all transform"
        >
          <span>SEND TO</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </footer>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120]">
      {mode === 'post' && renderCameraUI()}
      {mode === 'edit' && renderEdit()}
      {mode === 'selection' && (
         <div className="fixed inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center p-8 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center">
               <h2 className="text-4xl font-black text-white tracking-tighter italic brand-text">InstaMarket</h2>
               <p className="text-white/40 font-bold mt-2 uppercase tracking-[0.3em] text-[10px]">What's your vision?</p>
            </div>
            <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
               <button onClick={() => setMode('post')} className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center space-y-4 hover:bg-white/10 transition-all group active:scale-95">
                  <div className="p-5 bg-purple-600/20 rounded-2xl text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                    <ImageIcon className="w-9 h-9" />
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-widest text-white/70">Story</span>
               </button>
               <button onClick={() => setMode('live')} className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center space-y-4 hover:bg-white/10 transition-all group active:scale-95">
                  <div className="p-5 bg-pink-600/20 rounded-2xl text-pink-500 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-lg">
                    <Radio className="w-9 h-9" />
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-widest text-white/70">Live</span>
               </button>
            </div>
            <button onClick={onCancel} className="text-white/20 font-black uppercase text-[10px] tracking-[0.4em] pt-8 hover:text-white transition-colors">Cancel</button>
         </div>
      )}
    </div>
  );
};

export default CreateTab;