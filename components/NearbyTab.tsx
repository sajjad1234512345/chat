
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Search, Navigation, Users, Store, Calendar, Filter, List, Locate, Plus, X, Camera, Clock, Shield, Sparkles, Image as ImageIcon, ChevronLeft, Zap, Target } from 'lucide-react';

interface NearbyEvent {
  id: string;
  type: 'event' | 'exceptional';
  name: string;
  dist: string;
  coords: [number, number];
  date: string;
  time: string;
  privacy: 'Public' | 'Private' | 'Exceptional';
  image?: string;
}

const INITIAL_EVENTS: NearbyEvent[] = [
  { id: 'e1', type: 'event', name: 'Elite Coffee Meetup', dist: '500m', coords: [0.003, -0.001], date: '2024-06-15', time: '10:00', privacy: 'Public', image: 'https://picsum.photos/seed/cafe/400/300' },
  { id: 'e2', type: 'exceptional', name: 'Vibrant Opening Gala', dist: '1.5km', coords: [-0.004, 0.002], date: '2024-06-20', time: '19:00', privacy: 'Exceptional', image: 'https://picsum.photos/seed/gala/400/300' },
  { id: 'e3', type: 'event', name: 'Digital Art Showcase', dist: '800m', coords: [0.001, 0.005], date: '2024-06-18', time: '14:00', privacy: 'Public', image: 'https://picsum.photos/seed/art/400/300' },
];

const NearbyTab: React.FC = () => {
  const [view, setView] = useState<'map' | 'create-event'>('map');
  const [filter, setFilter] = useState('All');
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const eventMarkersRef = useRef<L.Marker[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const [address, setAddress] = useState('');
  const [events, setEvents] = useState<NearbyEvent[]>(INITIAL_EVENTS);

  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    privacy: 'Public' as 'Public' | 'Private' | 'Exceptional',
    image: null as string | null,
    coords: null as [number, number] | null
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setNewEvent({ ...newEvent, image: event.target?.result as string });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const initMap = () => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, { 
      zoomControl: false, 
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true
    }).setView([0, 0], 2);
    
    mapRef.current = map;

    // Use CartoDB Positron (Light/White) for the "Write-on" effect
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { 
      maxZoom: 20,
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const destIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 bg-pink-500/40 rounded-full animate-ping"></div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.3))">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="url(#grad_nearby_white)" />
            <circle cx="12" cy="9" r="3" fill="white" />
            <defs>
              <linearGradient id="grad_nearby_white" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        </div>`,
      className: 'destination-marker', iconSize: [32, 32], iconAnchor: [16, 32]
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setLatLng([lat, lng]);
      } else {
        destinationMarkerRef.current = L.marker([lat, lng], { icon: destIcon }).addTo(map);
      }
      
      setNewEvent(prev => ({ ...prev, coords: [lat, lng] }));
      reverseGeocode(lat, lng).then(addr => setAddress(addr));
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        const userIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-14 h-14 bg-blue-500/10 rounded-full animate-pulse blur-md"></div>
              <div class="absolute w-24 h-24 border border-blue-400/20 rounded-full animate-[ping_4s_linear_infinite]"></div>
              <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_15px_rgba(37,99,235,0.6)] z-10"></div>
            </div>`,
          className: 'user-location-marker', iconSize: [24, 24], iconAnchor: [12, 12]
        });
        
        userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
        map.setView([userLat, userLng], 15);
        renderMarkers(userLat, userLng);
      });

      watchIdRef.current = navigator.geolocation.watchPosition((position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        if (userMarkerRef.current) userMarkerRef.current.setLatLng([lat, lng]);
      });
    }
  };

  const renderMarkers = (userLat: number, userLng: number) => {
    const map = mapRef.current;
    if (!map) return;

    eventMarkersRef.current.forEach(m => map.removeLayer(m));
    eventMarkersRef.current = [];

    events.forEach(event => {
      const isExceptional = event.privacy === 'Exceptional';
      const color = isExceptional ? '#EAB308' : '#EC4899';
      const shadowColor = isExceptional ? 'rgba(234, 179, 8, 0.4)' : 'rgba(236, 72, 153, 0.4)';
      
      const iconHtml = `
        <div class="relative group">
          <div class="absolute -inset-3 bg-[${color}]/20 rounded-full blur-xl group-hover:bg-[${color}]/40 transition-all duration-300"></div>
          <div class="w-10 h-10 bg-[${color}] rounded-2xl border-2 border-white shadow-[0_8px_20px_${shadowColor}] flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
            ${isExceptional ? '<span class="text-xl">✨</span>' : '<span class="text-lg">📅</span>'}
          </div>
          ${isExceptional ? `<div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-bounce shadow-lg"></div>` : ''}
        </div>`;
      
      const icon = L.divIcon({
        html: iconHtml,
        className: 'event-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([userLat + event.coords[0], userLng + event.coords[1]], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-0 min-w-[200px] bg-white overflow-hidden rounded-[2.2rem] border border-zinc-200 shadow-2xl">
            <div class="h-32 w-full bg-zinc-100 relative">
               <img src="${event.image || `https://picsum.photos/seed/${event.id}/200/120`}" class="w-full h-full object-cover" />
               <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
               <div class="absolute bottom-3 left-4">
                  <span class="text-[9px] font-black text-pink-600 uppercase tracking-[0.2em] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-pink-100 shadow-sm">${event.privacy}</span>
               </div>
            </div>
            <div class="p-5">
              <h4 class="font-black text-[16px] mb-2.5 text-zinc-900 tracking-tight leading-none">${event.name}</h4>
              <div class="flex items-center text-[10px] text-zinc-400 space-x-4">
                <span class="flex items-center font-bold tracking-widest uppercase">📅 ${event.date}</span>
                <span class="flex items-center font-bold tracking-widest uppercase">⏰ ${event.time}</span>
              </div>
              <button class="w-full mt-5 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-xl hover:shadow-zinc-500/20 active:scale-95 transition-all">Join Vibe</button>
            </div>
          </div>
        `, {
          className: 'custom-leaflet-popup',
          closeButton: false
        });
      
      eventMarkersRef.current.push(marker);
    });
  };

  useEffect(() => {
    initMap();
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event: NearbyEvent = {
      id: `e-${Date.now()}`,
      type: newEvent.privacy === 'Exceptional' ? 'exceptional' : 'event',
      name: newEvent.name,
      dist: '0m',
      coords: newEvent.coords || [0.001, 0.001],
      date: newEvent.date,
      time: newEvent.time,
      privacy: newEvent.privacy,
      image: newEvent.image || undefined
    };
    setEvents([event, ...events]);
    setView('map');
    if (userMarkerRef.current) {
      const pos = userMarkerRef.current.getLatLng();
      renderMarkers(pos.lat, pos.lng);
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-120px)] w-full bg-[#f8f9fa] overflow-hidden">
      {/* Map Container - Optimized for "Write-on" White Theme */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 z-0 block w-full h-full bg-[#f8f9fa]" 
        style={{ filter: 'saturate(1.2) contrast(1.05)' }}
      />

      {/* Global Background Glows - Adjusted for Light Mode */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-pink-500/[0.03] blur-[140px] rounded-full" />
      </div>

      {/* Glass Search UI - Darker glass for better contrast on white */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur-3xl rounded-[2.5rem] flex items-center px-6 py-4.5 shadow-2xl pointer-events-auto max-w-lg mx-auto border border-white/10 ring-1 ring-white/5">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-full flex items-center justify-center text-white mr-4 shadow-xl shadow-pink-600/30">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search the white canvas..." 
            className="bg-transparent border-none outline-none w-full text-sm font-bold text-white placeholder-white/40" 
            value={address} 
            readOnly 
          />
          <div className="h-6 w-px bg-white/20 mx-4" />
          <button className="p-1 text-white/60 hover:text-pink-500 transition-colors pointer-events-auto">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories - High Contrast Dark Mode Buttons */}
      <div className="absolute top-24 left-4 right-4 z-10 flex space-x-3 overflow-x-auto scrollbar-hide pb-2 px-2 pointer-events-auto">
        {['All', 'Hot Spots', 'Market', 'Events', 'Elite'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`flex-shrink-0 px-7 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-300 active:scale-95 border ${filter === f ? 'bg-pink-600 text-white border-pink-500 shadow-pink-500/50' : 'bg-zinc-900/80 backdrop-blur-3xl text-white/60 border-white/5 hover:border-white/20 hover:text-white'}`}
          >
            {f === 'Hot Spots' && <Zap className="w-3 h-3 inline mr-1 mb-0.5" />}
            {f === 'Elite' && <Sparkles className="w-3 h-3 inline mr-1 mb-0.5" />}
            {f}
          </button>
        ))}
      </div>

      {/* Floating Controls - High Contrast */}
      <div className="absolute bottom-32 right-4 z-10 flex flex-col space-y-4 pointer-events-auto">
        <button className="p-4.5 bg-zinc-900/90 backdrop-blur-3xl rounded-3xl shadow-2xl text-white/60 border border-white/10 hover:text-white active:scale-95 transition-all">
          <Navigation className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { if (userMarkerRef.current && mapRef.current) mapRef.current.setView(userMarkerRef.current.getLatLng(), 16); }} 
          className="p-4.5 bg-zinc-900 text-white rounded-3xl shadow-2xl active:scale-95 transition-all border border-white/10"
        >
          <Locate className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Card: Nearby Happenings - Darker theme for better separation */}
      {view === 'map' && (
        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="bg-zinc-900/95 backdrop-blur-3xl px-7 py-7 rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/10 max-w-lg mx-auto overflow-hidden relative group">
            <div className="absolute top-[-30%] right-[-30%] w-64 h-64 bg-pink-600/10 blur-[110px] rounded-full group-hover:bg-pink-600/20 transition-all duration-700"></div>
            
            <div className="flex justify-between items-center mb-7 relative z-10">
              <div className="flex items-center space-x-3.5">
                 <Target className="w-5.5 h-5.5 text-pink-500" />
                 <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">Vibes in Radius</h3>
              </div>
              <button 
                onClick={() => setView('create-event')} 
                className="bg-white text-zinc-900 px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 active:scale-95 transition-all group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Host Now</span>
              </button>
            </div>

            <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-1.5 relative z-10">
              {events.map(item => (
                <div key={item.id} className="flex flex-col items-center space-y-3 group cursor-pointer flex-shrink-0 w-24">
                  <div className="relative">
                    <div className="absolute inset-0 bg-pink-600/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src={item.image || `https://picsum.photos/seed/${item.id}/120/120`} className="w-18 h-18 rounded-[2rem] object-cover ring-2 ring-white/10 shadow-2xl transition-all group-hover:scale-110 group-hover:-translate-y-1.5" />
                    <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-zinc-800 rounded-full shadow-2xl flex items-center justify-center border border-white/20 scale-90">
                      {item.privacy === 'Exceptional' ? <span className="text-[11px]">✨</span> : <span className="text-[11px]">📅</span>}
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-white/50 truncate w-full text-center uppercase tracking-tight group-hover:text-pink-500 transition-colors">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Host Event Drawer Overlay */}
      {view === 'create-event' && (
        <div className="absolute inset-x-0 bottom-0 top-0 z-50 bg-[#f8f9fa]/95 backdrop-blur-3xl overflow-y-auto animate-in slide-in-from-bottom duration-500">
          <div className="p-8 pb-32 max-w-lg mx-auto min-h-full">
            <header className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-6">
                <button onClick={() => setView('map')} className="p-3.5 bg-zinc-900/5 rounded-2xl shadow-sm border border-zinc-200 hover:bg-zinc-100 active:scale-95 transition-all">
                  <ChevronLeft className="w-7 h-7 text-zinc-900" />
                </button>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Host Your Vibe</h2>
              </div>
            </header>

            <form onSubmit={handleCreateEvent} className="space-y-10">
              <div 
                onClick={() => document.getElementById('event-img-upload-nearby')?.click()}
                className="w-full aspect-video bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-[3.5rem] flex flex-col items-center justify-center text-zinc-400 space-y-4 cursor-pointer hover:bg-zinc-50 hover:border-pink-500/50 transition-all overflow-hidden shadow-sm group"
              >
                {newEvent.image ? (
                  <img src={newEvent.image} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="p-5 bg-white rounded-[2rem] shadow-sm group-hover:bg-pink-50 transition-colors">
                      <ImageIcon className="w-11 h-11 group-hover:text-pink-500" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Drop Banner Asset</span>
                  </>
                )}
                <input id="event-img-upload-nearby" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              <div className="space-y-8">
                <div className="bg-white p-7 rounded-[2.5rem] border border-zinc-200 shadow-sm focus-within:ring-2 ring-pink-500/10 transition-all">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Event Vibe</label>
                  <input required type="text" placeholder="e.g. Neon Rooftop Party" className="w-full bg-transparent border-none p-0 outline-none text-2xl font-black text-zinc-900 placeholder-zinc-200" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-white p-7 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Date</label>
                    <input required type="date" className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-zinc-900" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                  </div>
                  <div className="bg-white p-7 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Time</label>
                    <input required type="time" className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-zinc-900" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 ml-2">Privacy & Tiers</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'Public', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { id: 'Private', icon: Shield, color: 'text-zinc-400', bg: 'bg-zinc-50' },
                      { id: 'Exceptional', icon: Sparkles, color: 'text-yellow-600', bg: 'bg-yellow-50' }
                    ].map(tier => (
                      <button 
                        key={tier.id}
                        type="button"
                        onClick={() => setNewEvent({...newEvent, privacy: tier.id as any})}
                        className={`flex flex-col items-center p-6 rounded-[2.5rem] border-2 transition-all ${newEvent.privacy === tier.id ? 'border-pink-500 bg-white shadow-xl scale-105' : 'border-zinc-100 bg-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <div className={`p-4 ${tier.bg} rounded-2xl mb-3 ${tier.color}`}>
                          <tier.icon className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-zinc-900 tracking-widest">{tier.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-7 bg-zinc-900 rounded-[3rem] flex items-center justify-between border border-white/10 shadow-2xl">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 bg-pink-600/30 rounded-2xl text-pink-500">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5 text-white">Drop Pin</p>
                      <p className="text-[11px] text-white/40 font-bold leading-none tracking-tight">Tap map through form</p>
                    </div>
                  </div>
                  {newEvent.coords && <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse border-2 border-[#1f1f23] shadow-[0_0_20px_rgba(34,197,94,0.8)]" />}
                </div>
              </div>

              <button type="submit" className="w-full bg-zinc-900 text-white py-6 rounded-[3rem] font-black text-lg shadow-xl hover:shadow-zinc-500/20 active:scale-[0.98] transition-all tracking-[0.3em] uppercase">
                LAUNCH VIBE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Style for Popups */}
      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          padding: 0;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 2.2rem;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: #ffffff !important;
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          border-radius: 2.2rem;
        }
      `}</style>
    </div>
  );
};

export default NearbyTab;
