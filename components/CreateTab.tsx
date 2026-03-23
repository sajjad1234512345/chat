import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Camera, Image as ImageIcon, Video, Radio, Users, ChevronLeft, ChevronRight, Send, Music, Zap, ZapOff, Settings, RefreshCw, Layers, Check, Share2, Smile, MapPin, Trash2, Sun, Moon, Sparkles, Search, MoreVertical, Box, Shield, Database, LayoutGrid, Settings2, User, Type, Infinity, CircleDot, CircleDashed, Circle, ArrowLeftRight, Undo2, Download, Sticker, MoreHorizontal, Crown } from 'lucide-react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

interface CreateTabProps {
  onCancel: () => void;
  initialMode?: 'post' | 'live' | 'selection';
}

const FILTERS = [
  { id: 'cyber', name: 'CYBER', style: 'hue-rotate(180deg) saturate(1.4) contrast(1.2)', color: 'bg-cyan-500', icon: Box },
  { id: 'dream', name: 'DREAM', style: 'brightness(1.1) saturate(0.8) contrast(0.9)', color: 'bg-emerald-500', icon: Settings2 },
  { id: 'noir', name: 'NOIR', style: 'grayscale(1) contrast(1.2)', color: 'bg-zinc-600', icon: Database },
  { id: 'vivid', name: 'VIVID', style: 'saturate(1.5) contrast(1.1)', color: 'bg-orange-500', icon: User },
  { id: 'warm', name: 'WARM', style: 'sepia(0.3) saturate(1.4) hue-rotate(-10deg)', color: 'bg-purple-500', icon: Shield },
  { id: 'none', name: 'DEFAULT', style: 'none', color: 'bg-white/20', icon: LayoutGrid },
];

const FACE_FILTERS = [
  { id: 'none', name: 'NONE', icon: Smile },
  { id: 'glasses', name: 'GLASSES', icon: Sun },
  { id: 'blush', name: 'BLUSH', icon: CircleDot },
  { id: 'crown', name: 'CROWN', icon: Crown },
];

const CreateTab: React.FC<CreateTabProps> = ({ onCancel, initialMode = 'post' }) => {
  const [mode, setMode] = useState<'selection' | 'post' | 'live' | 'edit' | 'share'>(initialMode === 'post' ? 'post' : initialMode === 'live' ? 'live' : 'selection');
  const [capturedMedia, setCapturedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [flash, setFlash] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(FILTERS[5]); // Default to 'Standard'
  const [activeFaceFilter, setActiveFaceFilter] = useState(FACE_FILTERS[0]);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isDetectorLoading, setIsDetectorLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const requestRef = useRef<number>();

  const [cameraError, setCameraError] = useState(false);

  const initDetector = async () => {
    if (detectorRef.current || isDetectorLoading) return;
    setIsDetectorLoading(true);
    try {
      await tf.ready();
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'tfjs' as const,
        refineLandmarks: true,
      };
      detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
    } catch (err) {
      console.error("Detector init failed:", err);
    } finally {
      setIsDetectorLoading(false);
    }
  };

  const drawFilter = useCallback((faces: faceLandmarksDetection.Face[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || faces.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach(face => {
      const keypoints = face.keypoints;

      if (activeFaceFilter.id === 'glasses') {
        // Draw glasses
        const leftEye = keypoints.find(kp => kp.name === 'leftEye');
        const rightEye = keypoints.find(kp => kp.name === 'rightEye');
        
        if (leftEye && rightEye) {
          const eyeDist = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));
          const glassSize = eyeDist * 0.8;

          ctx.strokeStyle = 'black';
          ctx.lineWidth = 4;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

          // Left lens
          ctx.beginPath();
          ctx.arc(leftEye.x, leftEye.y, glassSize / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Right lens
          ctx.beginPath();
          ctx.arc(rightEye.x, rightEye.y, glassSize / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Bridge
          ctx.beginPath();
          ctx.moveTo(leftEye.x + glassSize / 2, leftEye.y);
          ctx.lineTo(rightEye.x - glassSize / 2, rightEye.y);
          ctx.stroke();
        }
      } else if (activeFaceFilter.id === 'blush') {
        // Draw blush
        const leftCheek = keypoints[234]; // Approximate cheek landmark
        const rightCheek = keypoints[454];

        if (leftCheek && rightCheek) {
          ctx.fillStyle = 'rgba(255, 100, 100, 0.4)';
          ctx.beginPath();
          ctx.arc(leftCheek.x, leftCheek.y, 20, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(rightCheek.x, rightCheek.y, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeFaceFilter.id === 'crown') {
        // Draw crown
        const forehead = keypoints[10]; // Top of forehead
        if (forehead) {
          ctx.fillStyle = '#FFD700';
          ctx.strokeStyle = '#B8860B';
          ctx.lineWidth = 2;

          const size = 60;
          ctx.beginPath();
          ctx.moveTo(forehead.x - size, forehead.y - size);
          ctx.lineTo(forehead.x - size / 2, forehead.y - size / 2);
          ctx.lineTo(forehead.x, forehead.y - size);
          ctx.lineTo(forehead.x + size / 2, forehead.y - size / 2);
          ctx.lineTo(forehead.x + size, forehead.y - size);
          ctx.lineTo(forehead.x + size, forehead.y);
          ctx.lineTo(forehead.x - size, forehead.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
    });
  }, [activeFaceFilter]);

  const detect = useCallback(async () => {
    if (detectorRef.current && videoRef.current && videoRef.current.readyState === 4) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (canvas) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      }

      const faces = await detectorRef.current.estimateFaces(video);
      drawFilter(faces);
    }
  }, [drawFilter]);

  useEffect(() => {
    if (mode === 'post' || mode === 'live') {
      initDetector();
    }
  }, [mode]);

  useEffect(() => {
    let isActive = true;
    const runDetection = async () => {
      if (mode === 'post' || mode === 'live') {
        await detect();
        if (isActive) {
          requestRef.current = requestAnimationFrame(runDetection);
        }
      }
    };

    if (mode === 'post' || mode === 'live') {
      requestRef.current = requestAnimationFrame(runDetection);
    }

    return () => {
      isActive = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mode, detect]);

  const startCamera = async () => {
    setCameraError(false);
    try {
      // Try with audio first, fallback to video only if audio fails
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: cameraFacing }, 
          audio: true 
        });
      } catch (audioErr) {
        console.warn("Audio access denied, falling back to video only", audioErr);
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: cameraFacing }
        });
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      
      // Provide more specific feedback if possible
      if (err.name === 'NotAllowedError') {
        console.error("Permission denied by user.");
      } else if (err.name === 'NotFoundError') {
        console.error("No camera found.");
      } else if (err.name === 'NotReadableError') {
        console.error("Camera is already in use.");
      }
      
      setCameraError(true);
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
  }, [mode, cameraFacing]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = activeFilter.style;
        if (cameraFacing === 'user') {
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
          ctx.scale(-1, 1); // Reset scale for drawing filters
        } else {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        }

        // Draw face filters on the captured image
        if (activeFaceFilter.id !== 'none' && detectorRef.current) {
          // We need to run detection one last time on the video frame or use the last known positions
          // For simplicity, we'll draw what's currently on the overlay canvas if we had it
          // But it's better to just draw the current state of the overlay canvas onto this one
          if (canvasRef.current) {
            if (cameraFacing === 'user') {
              ctx.scale(-1, 1);
              ctx.drawImage(canvasRef.current, -canvas.width, 0, canvas.width, canvas.height);
            } else {
              ctx.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height);
            }
          }
        }

        setCapturedMedia({ url: canvas.toDataURL('image/jpeg'), type: 'image' });
        setMode('edit');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedMedia({ url: event.target.result as string, type: 'image' });
          setMode('edit');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCameraUI = () => (
    <div className="fixed inset-0 bg-black flex flex-col text-text-primary animate-in fade-in duration-300 overflow-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileSelect} 
      />
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{ filter: activeFilter.style }}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-500 ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`} 
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover z-10 pointer-events-none ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`}
      />

      {cameraError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-base-bg/80 backdrop-blur-md px-8 text-center">
          <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mb-6">
            <Camera className="w-8 h-8 text-danger" />
          </div>
          <h3 className="text-h1 text-text-primary mb-2">Camera Access Denied</h3>
          <p className="text-text-secondary text-body-default mb-8">Please enable camera permissions in your browser settings to use this feature.</p>
          <button 
            onClick={() => setMode('selection')}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Top Bar - Screenshot Style */}
      <header 
        className="px-6 pt-8 flex items-center justify-between z-50 relative"
        style={{ paddingLeft: '5px', paddingRight: '24px', marginRight: '-9px', marginBottom: '-4px', marginTop: '-16px' }}
      >
        <button onClick={onCancel} className="btn-icon bg-transparent border-none text-text-primary drop-shadow-md active:scale-90 transition-transform">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
          <button onClick={() => setFlash(!flash)} className="btn-icon bg-transparent border-none text-text-primary drop-shadow-md active:scale-90 transition-transform">
            {flash ? <Zap className="w-5 h-5 fill-warning text-warning" /> : <ZapOff className="w-5 h-5" />}
          </button>
          <button className="btn-icon bg-transparent border-none text-text-primary drop-shadow-md active:scale-90 transition-transform">
            <Moon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCameraFacing(prev => prev === 'user' ? 'environment' : 'user')}
            className="btn-icon bg-transparent border-none text-text-primary drop-shadow-md active:rotate-180 transition-transform"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <button className="btn-icon bg-transparent border-none text-text-primary drop-shadow-md active:scale-90 transition-transform">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Left Sidebar - Screenshot Style */}
      <div 
        className="absolute left-6 top-[25%] flex flex-col items-center space-y-5 z-40 animate-in slide-in-from-left duration-700"
        style={{ marginLeft: '-18px', marginBottom: '8px', marginTop: '-74px' }}
      >
         <button className="p-1 rounded-lg hover:bg-white/10 transition-colors text-text-primary">
           <Type className="w-5 h-5" />
         </button>
         <button className="p-1 rounded-lg hover:bg-white/10 transition-colors text-text-primary">
           <Infinity className="w-5 h-5" />
         </button>
         <button className="p-1 rounded-lg hover:bg-white/10 transition-colors text-text-primary">
           <LayoutGrid className="w-5 h-5" />
         </button>
      </div>

      <div className="flex-grow pointer-events-none" />

      {/* Bottom Controls - Screenshot Style */}
      <footer className="pb-4 flex flex-col items-center justify-center relative z-30">
        <div 
          className="flex items-center justify-between w-full px-12 mb-14 relative"
          style={{ marginLeft: '0px', marginTop: '-73px', marginBottom: '25px' }}
        >
          {/* Gallery Preview */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-lg glass-level-1 overflow-hidden active:scale-90 transition-transform"
            style={{ marginLeft: '-39px' }}
          >
            <img 
              src="https://picsum.photos/seed/gallery/100/100" 
              className="w-full h-full object-cover opacity-60" 
              alt="" 
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Main Capture Button - Centered at midpoint */}
          <button 
            onClick={handleCapture}
            className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-[4px] border-white/30 p-0.5 active:scale-90 transition-transform z-10"
            style={{ marginLeft: '-9px' }}
          >
            <div 
              className="w-full h-full rounded-full bg-text-primary shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
              style={{ marginRight: '-15px', marginLeft: '0px' }}
            />
          </button>

          {/* Filter & Placeholder */}
          <div className="flex items-center absolute right-8">
            <div 
              className="flex items-center glass-level-2 rounded-full p-1.5 shadow-2xl"
              style={{ height: '49px', width: '158px', paddingLeft: '-9px', paddingTop: '5px', paddingBottom: '7px', paddingRight: '-2px', marginRight: '-28px', marginLeft: '-16px', marginBottom: '-61px', marginTop: '-66px' }}
            >
              <div 
                className="flex -space-x-1 overflow-x-auto max-w-[160px] no-scrollbar px-1"
                style={{ height: '36px' }}
              >
                {FACE_FILTERS.map((f, index) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFaceFilter(f)}
                    className={`relative w-10 h-10 rounded-full transition-all duration-300 shrink-0 flex items-center justify-center group ${
                      activeFaceFilter.id === f.id 
                        ? 'bg-text-primary scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-20' 
                        : 'hover:bg-white/20 z-10'
                    }`}
                    style={index === 0 ? { height: '26px', marginBottom: '7px', marginTop: '6px' } : {}}
                  >
                    <f.icon 
                      className={`w-5 h-5 transition-colors duration-300 ${
                        activeFaceFilter.id === f.id ? 'text-base-bg' : 'text-text-primary group-hover:text-text-primary'
                      }`} 
                      style={index === 3 || index === 2 || index === 1 ? { height: '18px' } : {}}
                    />
                    {activeFaceFilter.id === f.id && (
                      <div className="absolute -bottom-1 w-1.5 h-1.5 bg-text-primary rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mode Tabs - 'Story' centered at midpoint */}
        <div className="w-full flex items-center text-label text-text-muted">
          <div className="flex-1 flex justify-end pr-6">
            <button className="hover:text-text-primary transition-colors">Post</button>
          </div>
          <button className="text-text-primary relative shrink-0 px-2">
            Story
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-text-primary rounded-full" />
          </button>
          <div className="flex-1 flex justify-start pl-6 space-x-6">
            <button className="hover:text-text-primary transition-colors">Reel</button>
            <button className="hover:text-text-primary transition-colors">Live</button>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderEditUI = () => (
    <div className="fixed inset-0 bg-black flex flex-col text-text-primary animate-in fade-in duration-300 overflow-hidden">
      {capturedMedia && (
        <img src={capturedMedia.url} className="absolute inset-0 w-full h-full object-cover z-0" alt="" referrerPolicy="no-referrer" />
      )}

      {/* Top Bar - Screenshot Style */}
      <header className="px-6 pt-12 flex items-center justify-between z-50 relative">
        <button onClick={() => setMode('post')} className="btn-icon bg-transparent border-none text-text-primary active:scale-95 transition-transform">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <div className="flex items-center space-x-5">
          <button className="active:scale-90 transition-transform"><Type className="w-6 h-6" /></button>
          <button className="active:scale-90 transition-transform"><Sticker className="w-6 h-6" /></button>
          <button className="active:scale-90 transition-transform"><Sparkles className="w-6 h-6" /></button>
          <button className="active:scale-90 transition-transform"><Music className="w-6 h-6" /></button>
          <button className="active:scale-90 transition-transform"><MoreHorizontal className="w-6 h-6" /></button>
        </div>
      </header>

      <div className="flex-grow" />

      {/* Bottom Controls - Screenshot Style */}
      <footer className="p-6 pb-12 flex items-center justify-between z-50 relative">
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 glass-level-1 px-4 py-2.5 rounded-full active:scale-95 transition-transform">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200" className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
            </div>
            <span className="text-body-small font-bold">Your story</span>
          </button>
          <button className="flex items-center space-x-2 glass-level-1 px-4 py-2.5 rounded-full active:scale-95 transition-transform">
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
              <Smile className="w-4 h-4 text-text-primary" />
            </div>
            <span className="text-body-small font-bold">Close Friends</span>
          </button>
        </div>
        <button onClick={() => setMode('share')} className="w-12 h-12 bg-text-primary rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform">
          <ChevronRight className="w-7 h-7 text-base-bg" />
        </button>
      </footer>
    </div>
  );


  const renderShare = () => (
    <div className="fixed inset-0 z-[130] bg-base-bg flex flex-col text-text-primary animate-in slide-in-from-bottom duration-500">
      <header className="px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-4">
          <button onClick={() => setMode('edit')} className="btn-icon bg-transparent border-none text-text-primary active:scale-90 transition-transform">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <h2 className="text-h2">Share</h2>
        </div>
        <button className="btn-icon bg-transparent border-none text-text-muted">
          <MoreVertical className="w-6 h-6" />
        </button>
      </header>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search" 
            className="input-field w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pb-10 px-5 pt-4">
        <h3 className="text-label text-text-muted mb-5">Recent Contacts</h3>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full glass-level-1 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i + 20}/100/100`} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="w-32 h-2.5 bg-surface-1 rounded-full mb-2" />
                  <div className="w-20 h-2 bg-surface-2 rounded-full" />
                </div>
              </div>
              <button 
                onClick={onCancel}
                className="btn-primary py-2 px-5 text-xs uppercase tracking-widest"
              >
                Send
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120]">
      {(mode === 'post' || mode === 'live') && renderCameraUI()}
      {mode === 'edit' && renderEditUI()}
      {mode === 'share' && renderShare()}
      {mode === 'selection' && (
         <div className="fixed inset-0 bg-base-bg flex flex-col items-center justify-center p-8 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center">
               <h2 className="text-display text-text-primary italic brand-text">Games</h2>
               <p className="text-label text-text-muted mt-2">What's your vision?</p>
            </div>
            <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
               <button onClick={() => setMode('post')} className="aspect-square glass-level-1 rounded-[3rem] flex flex-col items-center justify-center space-y-4 hover:bg-white/5 transition-all group active:scale-95">
                  <div className="p-5 bg-purple-600/20 rounded-2xl text-purple-500 group-hover:bg-purple-600 group-hover:text-text-primary transition-all shadow-lg">
                    <ImageIcon className="w-9 h-9" />
                  </div>
                  <span className="text-label text-text-secondary">Story</span>
               </button>
               <button onClick={() => setMode('live')} className="aspect-square glass-level-1 rounded-[3rem] flex flex-col items-center justify-center space-y-4 hover:bg-white/5 transition-all group active:scale-95">
                  <div className="p-5 bg-pink-600/20 rounded-2xl text-pink-500 group-hover:bg-pink-600 group-hover:text-text-primary transition-all shadow-lg">
                    <Radio className="w-9 h-9" />
                  </div>
                  <span className="text-label text-text-secondary">Live</span>
               </button>
            </div>
            <button onClick={onCancel} className="btn-pill text-text-muted hover:text-text-primary transition-colors">Cancel</button>
         </div>
      )}
    </div>
  );
};

export default CreateTab;
