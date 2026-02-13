
import React, { useState, useRef, useEffect } from 'react';
/* Added ChevronRight to the lucide-react imports to fix "Cannot find name 'ChevronRight'" errors on lines 361 and 365 */
import { X, Camera, Image as ImageIcon, Video, Radio, Users, ChevronLeft, ChevronRight, Send, Music, Zap, Settings, RefreshCw, Layers, Check, Share2, Smile, MapPin } from 'lucide-react';

interface CreateTabProps {
  onCancel: () => void;
}

const CreateTab: React.FC<CreateTabProps> = ({ onCancel }) => {
  const [mode, setMode] = useState<'selection' | 'post' | 'live' | 'edit'>('selection');
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [isRecording, setIsRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const pressTimerRef = useRef<number | null>(null);
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
    if (mode === 'live' || mode === 'post') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode]);

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedMedia([...capturedMedia, { url: dataUrl, type: 'image' }]);
      }
    }
  };

  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setCapturedMedia(prev => [...prev, { url, type: 'video' }]);
      };

      recorder.start();
      setIsRecording(true);
      setPostType('video');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePointerDown = () => {
    pressTimerRef.current = window.setTimeout(() => {
      startRecording();
    }, 400);
  };

  const handlePointerUp = () => {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    if (isRecording) {
      stopRecording();
    } else {
      handleCapturePhoto();
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Cast the result of Array.from(e.target.files) to File[] to ensure the type system recognizes file.type and file as a Blob.
      const files = Array.from(e.target.files) as File[];
      setSelectedGalleryFiles([...selectedGalleryFiles, ...files]);
      const newMedia = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image' as any
      }));
      setCapturedMedia([...capturedMedia, ...newMedia]);
    }
  };

  const handleShare = () => {
    // In a real app, this would send data to backend
    console.log("Post Shared:", { capturedMedia, caption });
    onCancel();
  };

  const renderSelection = () => (
    <div className="p-8 h-full flex flex-col justify-center items-center space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-900">Create New</h2>
        <p className="text-gray-400 font-medium">What's on your mind today?</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
        <button 
          onClick={() => { setMode('post'); setPostType('image'); }}
          className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center space-y-4 hover:scale-105 transition-transform group"
        >
          <div className="p-4 bg-purple-100 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <ImageIcon className="w-8 h-8" />
          </div>
          <span className="font-bold text-gray-700">Add Post</span>
        </button>

        <button 
          onClick={() => { setMode('live'); }}
          className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center space-y-4 hover:scale-105 transition-transform group"
        >
          <div className="p-4 bg-pink-100 rounded-2xl text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
            <Radio className="w-8 h-8" />
          </div>
          <span className="font-bold text-gray-700">Go Live</span>
        </button>
      </div>

      <button onClick={onCancel} className="mt-8 text-gray-400 hover:text-gray-900 font-bold flex items-center space-x-1">
        <X className="w-5 h-5" />
        <span>Cancel</span>
      </button>
    </div>
  );

  const renderPost = () => (
    <div className="bg-black min-h-screen flex flex-col text-white animate-in slide-in-from-bottom duration-300 overflow-hidden">
      <header className="p-4 flex items-center justify-between z-20 glass m-2 rounded-2xl">
        <button onClick={() => setMode('selection')} className="p-2 bg-white/10 rounded-full">
          <X className="w-6 h-6" />
        </button>
        <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest items-center">
          <span className="text-white border-b-2 border-white pb-1">Camera</span>
          <span className="text-white/40">Gallery</span>
        </div>
        <button 
          disabled={capturedMedia.length === 0}
          onClick={() => setMode('edit')}
          className={`font-black text-sm px-4 py-1.5 rounded-full transition-all ${capturedMedia.length > 0 ? 'bg-pink-600 text-white shadow-lg active:scale-95' : 'text-white/20'}`}
        >
          Next ({capturedMedia.length})
        </button>
      </header>

      <div className="flex-grow flex items-center justify-center relative bg-zinc-900 overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover scale-x-[-1] transition-opacity ${isRecording ? 'opacity-90' : 'opacity-100'}`} 
        />
        
        {isRecording && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-red-600 px-4 py-1 rounded-full animate-pulse z-30">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest">Recording</span>
          </div>
        )}

        <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-6 flex flex-col items-center z-10">
           <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60"><Music className="w-6 h-6" /></button>
           <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60"><Zap className="w-6 h-6" /></button>
           <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60"><Settings className="w-6 h-6" /></button>
           <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60"><Layers className="w-6 h-6" /></button>
        </div>

        {capturedMedia.length > 0 && (
          <div className="absolute left-4 bottom-40 flex flex-col space-y-2 z-10">
            {capturedMedia.slice(-3).map((m, i) => (
              <div key={i} className="w-12 h-12 rounded-xl border-2 border-white shadow-xl overflow-hidden animate-in slide-in-from-left duration-300">
                {m.type === 'image' ? (
                  <img src={m.url} className="w-full h-full object-cover" />
                ) : (
                  <video src={m.url} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="p-8 pb-12 flex flex-col items-center bg-black/50 backdrop-blur-xl absolute bottom-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between w-full max-w-sm">
          <div className="relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept="image/*,video/*" 
              onChange={handleFileChange}
            />
            <button 
              onClick={handleGalleryClick}
              className="w-14 h-14 bg-white/10 rounded-2xl overflow-hidden border border-white/20 flex items-center justify-center group active:scale-95 transition-all"
            >
              {selectedGalleryFiles.length > 0 ? (
                <div className="relative w-full h-full">
                  <img src={URL.createObjectURL(selectedGalleryFiles[selectedGalleryFiles.length-1])} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-black text-xs">+{selectedGalleryFiles.length}</span>
                  </div>
                </div>
              ) : (
                <ImageIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            {isRecording && (
              <div className="absolute w-[100px] h-[100px] border-4 border-red-500 rounded-full animate-ping" />
            )}
            <button 
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              className={`w-20 h-20 rounded-full border-4 transition-all duration-300 active:scale-90 ${isRecording ? 'border-red-500 p-2' : 'border-white p-1'}`}
            >
               <div className={`w-full h-full rounded-full transition-all duration-300 ${isRecording ? 'bg-red-500 rounded-xl' : 'bg-white'}`} />
            </button>
          </div>

          <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 active:rotate-180 transition-transform">
             <RefreshCw className="w-6 h-6 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );

  const renderEdit = () => (
    <div className="bg-white min-h-screen flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button onClick={() => setMode('post')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h2 className="text-xl font-black text-gray-900">New Post</h2>
        </div>
        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-2 rounded-full font-black text-sm shadow-lg shadow-pink-200 active:scale-95 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </header>

      <div className="flex-grow overflow-y-auto">
        {/* Media Preview Carousel */}
        <div className="bg-gray-50 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {capturedMedia.map((m, i) => (
            <div key={i} className="flex-shrink-0 w-full aspect-square snap-center relative">
               {m.type === 'image' ? (
                 <img src={m.url} className="w-full h-full object-cover" />
               ) : (
                 <video src={m.url} controls className="w-full h-full object-cover" />
               )}
               <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-black">
                 {i + 1} / {capturedMedia.length}
               </div>
            </div>
          ))}
        </div>

        {/* Editing Options */}
        <div className="p-6 space-y-8">
          {/* Caption Input */}
          <div className="flex items-start space-x-4">
            <img src="https://picsum.photos/seed/me/100/100" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-grow">
              <textarea 
                rows={3}
                placeholder="Write a caption..."
                className="w-full border-none outline-none text-sm resize-none py-2 font-medium"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <div className="flex items-center space-x-4 mt-2">
                <button className="text-gray-400 hover:text-pink-600 transition-colors"><Smile className="w-5 h-5" /></button>
                <button className="text-gray-400 hover:text-pink-600 transition-colors flex items-center space-x-1 text-xs font-bold uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />
                  <span>Add Location</span>
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Simulated Filters */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Filters</h3>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {['Normal', 'Clarendon', 'Gingham', 'Moon', 'Lark', 'Reyes'].map((filter, idx) => (
                <div key={filter} className="flex flex-col items-center space-y-2 flex-shrink-0 group cursor-pointer">
                   <div className={`w-16 h-16 rounded-2xl bg-gray-200 overflow-hidden border-2 ${idx === 0 ? 'border-pink-500' : 'border-transparent'}`}>
                     <img src={capturedMedia[0]?.url} className={`w-full h-full object-cover opacity-80 ${filter === 'Moon' ? 'grayscale' : ''}`} />
                   </div>
                   <span className={`text-[10px] font-bold ${idx === 0 ? 'text-pink-600' : 'text-gray-400'}`}>{filter}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4 pt-4">
             <button className="w-full flex items-center justify-between py-2 group">
               <span className="text-sm font-bold text-gray-700 group-hover:text-pink-600 transition-colors">Tag People</span>
               <ChevronRight className="w-5 h-5 text-gray-300" />
             </button>
             <button className="w-full flex items-center justify-between py-2 group">
               <span className="text-sm font-bold text-gray-700 group-hover:text-pink-600 transition-colors">Advanced Settings</span>
               <ChevronRight className="w-5 h-5 text-gray-300" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLive = () => (
    <div className="bg-black min-h-screen relative flex flex-col text-white animate-in slide-in-from-bottom duration-300">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-80 scale-x-[-1]" />
      
      <div className="relative z-10 flex-grow flex flex-col">
        <header className="p-6 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <button onClick={() => { setMode('selection'); setIsLive(false); }} className="p-2 bg-black/20 rounded-full backdrop-blur-md">
               <X className="w-6 h-6" />
             </button>
             {isLive && (
               <div className="bg-red-600 px-3 py-1 rounded-lg flex items-center space-x-1 animate-pulse">
                 <div className="w-1.5 h-1.5 bg-white rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
               </div>
             )}
           </div>
           {isLive && (
             <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-2xl backdrop-blur-md">
               <Users className="w-4 h-4" />
               <span className="text-xs font-bold">1,240</span>
             </div>
           )}
           <button className="p-2 bg-black/20 rounded-full backdrop-blur-md">
              <Settings className="w-6 h-6" />
           </button>
        </header>

        <div className="flex-grow flex items-center justify-center">
          {!isLive && (
            <div className="text-center space-y-4 px-12">
               <h3 className="text-4xl font-black leading-tight">Ready to start your stream?</h3>
               <p className="text-white/60 text-sm font-medium">Your followers will be notified once you go live.</p>
            </div>
          )}
        </div>

        <div className="p-8 space-y-6">
          {isLive && (
            <div className="h-48 overflow-y-auto space-y-3 mask-fade-top mb-4">
               {[
                 { user: 'alex_j', msg: 'So cool! 😍' },
                 { user: 'marta_k', msg: 'Where is this?' },
                 { user: 'pixel_art', msg: 'Love the lighting!' }
               ].map((c, i) => (
                 <div key={i} className="flex items-start space-x-3 animate-in slide-in-from-left duration-300">
                   <img src={`https://picsum.photos/seed/${c.user}/100/100`} className="w-8 h-8 rounded-full border border-white/20" />
                   <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl">
                     <span className="text-[10px] font-black mr-2">{c.user}</span>
                     <span className="text-xs">{c.msg}</span>
                   </div>
                 </div>
               ))}
            </div>
          )}

          <div className="flex items-center justify-center space-x-6">
             {isLive ? (
               <button 
                 onClick={() => setIsLive(false)}
                 className="bg-white text-black px-12 py-4 rounded-[2rem] font-black text-sm tracking-widest shadow-2xl transition-all active:scale-95"
               >
                 END STREAM
               </button>
             ) : (
               <button 
                 onClick={() => setIsLive(true)}
                 className="bg-gradient-to-r from-pink-600 to-rose-500 text-white px-12 py-4 rounded-[2.5rem] font-black text-sm tracking-widest shadow-2xl shadow-pink-500/30 transition-all active:scale-95"
               >
                 GO LIVE
               </button>
             )}
          </div>
          
          <div className="flex justify-center space-x-4">
             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md"><RefreshCw className="w-5 h-5" /></div>
             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md"><Users className="w-5 h-5" /></div>
             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md"><Send className="w-5 h-5" /></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#fafafa]">
      {mode === 'selection' && renderSelection()}
      {mode === 'post' && renderPost()}
      {mode === 'edit' && renderEdit()}
      {mode === 'live' && renderLive()}
    </div>
  );
};

export default CreateTab;