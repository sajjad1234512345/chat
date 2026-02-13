
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Users, Store, Calendar, Filter, List, Locate, Plus, X, Camera, Clock, Shield, Sparkles, Image as ImageIcon, ChevronLeft } from 'lucide-react';

declare const L: any;

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
  { id: 'e1', type: 'event', name: 'Coffee Meetup', dist: '500m', coords: [0.003, -0.001], date: '2024-06-15', time: '10:00', privacy: 'Public', image: 'https://picsum.photos/seed/cafe/400/300' },
  { id: 'e2', type: 'exceptional', name: 'Grand Opening Gala', dist: '1.5km', coords: [-0.004, 0.002], date: '2024-06-20', time: '19:00', privacy: 'Exceptional', image: 'https://picsum.photos/seed/gala/400/300' },
];

const NearbyTab: React.FC = () => {
  const [view, setView] = useState<'map' | 'create-event'>('map');
  const [filter, setFilter] = useState('All');
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const eventMarkersRef = useRef<any[]>([]);
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

    const map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([0, 0], 2);
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

    setTimeout(() => map.invalidateSize(), 200);

    const destIcon = L.divIcon({
      html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
      className: 'destination-marker', iconSize: [24, 24], iconAnchor: [12, 24]
    });

    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      if (destinationMarkerRef.current) destinationMarkerRef.current.setLatLng([lat, lng]);
      else destinationMarkerRef.current = L.marker([lat, lng], { icon: destIcon }).addTo(map);
      
      setNewEvent(prev => ({ ...prev, coords: [lat, lng] }));
      reverseGeocode(lat, lng).then(addr => setAddress(addr));
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        const userIcon = L.divIcon({
          html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
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
      const iconHtml = isExceptional 
        ? `<div class="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white shadow-xl flex items-center justify-center animate-bounce text-white">✨</div>`
        : `<div class="w-8 h-8 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">📅</div>`;
      
      const icon = L.divIcon({
        html: iconHtml,
        className: 'event-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([userLat + event.coords[0], userLng + event.coords[1]], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2 min-w-[150px]">
            <h4 class="font-black text-sm mb-1 text-gray-900">${event.name}</h4>
            <div class="flex items-center text-[10px] text-gray-500 mb-1">
              <span class="mr-2">📅 ${event.date}</span>
              <span>⏰ ${event.time}</span>
            </div>
            <div class="text-[9px] font-bold text-purple-600 uppercase tracking-tighter">${event.privacy} Event</div>
          </div>
        `);
      
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
    <div className="relative flex flex-col h-[calc(100vh-120px)] bg-gray-100 overflow-hidden">
      {/* Map Container remains background for context */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 block w-full h-full" />

      {/* Top Search Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <div className="glass rounded-2xl flex items-center px-4 py-2.5 shadow-xl pointer-events-auto max-w-lg mx-auto border border-white/20">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input type="text" placeholder="Explore location..." className="bg-transparent border-none outline-none w-full text-sm font-medium" value={address} readOnly />
          <div className="h-6 w-px bg-gray-200 mx-3" />
          <List className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="absolute top-20 left-4 right-4 z-10 flex space-x-2 overflow-x-auto scrollbar-hide pb-1 pointer-events-auto">
        {['All', 'Users', 'Products', 'Events', 'Exceptional'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md transition-all ${filter === f ? 'bg-pink-600 text-white' : 'glass text-gray-700'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Locate Button */}
      <button 
        onClick={() => { if (userMarkerRef.current) mapRef.current.setView(userMarkerRef.current.getLatLng(), 16); }} 
        className="absolute bottom-24 right-4 z-10 p-3 glass rounded-full shadow-2xl active:scale-95 transition-all text-blue-600"
      >
        <Locate className="w-6 h-6" />
      </button>

      {/* Create Event Overlay - Sliding Drawer Style */}
      {view === 'create-event' && (
        <div className="absolute inset-x-0 bottom-0 top-0 z-50 bg-white/40 backdrop-blur-3xl overflow-y-auto animate-in slide-in-from-bottom duration-500">
          <div className="p-6 pb-24 max-w-lg mx-auto min-h-full">
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button onClick={() => setView('map')} className="p-2 bg-white/80 rounded-full shadow-md">
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <h2 className="text-2xl font-black text-gray-900">Host New Event</h2>
              </div>
            </header>

            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div 
                onClick={() => document.getElementById('event-img-upload')?.click()}
                className="w-full aspect-video bg-white/60 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-400 space-y-2 cursor-pointer hover:bg-white transition-all overflow-hidden shadow-sm"
              >
                {newEvent.image ? (
                  <img src={newEvent.image} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-sm font-bold uppercase tracking-widest">Event Photo</span>
                  </>
                )}
                <input id="event-img-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              <div className="space-y-5">
                <div className="bg-white/80 p-4 rounded-3xl border border-white">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Event Title</label>
                  <input required type="text" placeholder="e.g. Summer Beach Party" className="w-full bg-transparent border-none p-0 outline-none text-base font-bold text-gray-900" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 p-4 rounded-3xl border border-white">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</label>
                    <input required type="date" className="w-full bg-transparent border-none p-0 outline-none text-sm font-bold" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                  </div>
                  <div className="bg-white/80 p-4 rounded-3xl border border-white">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</label>
                    <input required type="time" className="w-full bg-transparent border-none p-0 outline-none text-sm font-bold" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Privacy Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Public', icon: Users, color: 'text-blue-500' },
                      { id: 'Private', icon: Shield, color: 'text-gray-600' },
                      { id: 'Exceptional', icon: Sparkles, color: 'text-yellow-500' }
                    ].map(tier => (
                      <button 
                        key={tier.id}
                        type="button"
                        onClick={() => setNewEvent({...newEvent, privacy: tier.id as any})}
                        className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${newEvent.privacy === tier.id ? 'border-pink-500 bg-white shadow-lg scale-105' : 'border-white/50 bg-white/40'}`}
                      >
                        <tier.icon className={`w-5 h-5 mb-1 ${tier.color}`} />
                        <span className="text-[9px] font-black uppercase">{tier.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white/80 rounded-3xl flex items-center justify-between border border-white">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="text-xs font-black text-gray-900">Event Pin</p>
                      <p className="text-[10px] text-gray-500">{newEvent.coords ? 'Location Set' : 'Tap map through form to set'}</p>
                    </div>
                  </div>
                  {newEvent.coords && <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />}
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-orange-500 text-white py-4 rounded-3xl font-black text-lg shadow-xl shadow-pink-200 active:scale-95 transition-all">
                LAUNCH EVENT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Events Bottom Bar */}
      {view === 'map' && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="glass px-4 py-3 rounded-[2rem] shadow-2xl border border-white/40 backdrop-blur-3xl max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black tracking-tight text-gray-900 uppercase">Nearby Happening</h3>
              <button onClick={() => setView('create-event')} className="bg-pink-600 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1 hover:bg-pink-700 transition-all active:scale-95">
                <Plus className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Host</span>
              </button>
            </div>

            <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-1">
              {events.map(item => (
                <div key={item.id} className="flex flex-col items-center space-y-1 group cursor-pointer flex-shrink-0 w-16">
                  <div className="relative">
                    <img src={item.image || `https://picsum.photos/seed/${item.id}/100/100`} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm transition-transform group-hover:scale-110" />
                    <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-lg shadow-xs">
                      {item.privacy === 'Exceptional' ? <span className="text-[10px]">✨</span> : <span className="text-[10px]">📅</span>}
                    </div>
                  </div>
                  <p className="text-[8px] font-black text-gray-800 truncate w-full text-center">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyTab;
