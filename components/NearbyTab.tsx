
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Users, Store, Calendar, Filter, List, Locate, Plus, X, Camera, Clock, Shield, Sparkles, Image as ImageIcon } from 'lucide-react';

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

const MOCK_NEARBY_ITEMS = [
  { id: '1', type: 'user', name: 'Julian R.', dist: '200m', coords: [0.001, 0.001], avatar: 'https://picsum.photos/seed/u1/100/100' },
  { id: '2', type: 'product', name: 'Vintage Camera', dist: '1.2km', coords: [-0.002, 0.003], avatar: 'https://picsum.photos/seed/p1/100/100' },
];

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

  // Event Form State
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
      
      if (view === 'create-event') setNewEvent(prev => ({ ...prev, coords: [lat, lng] }));
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

    // Clear old event markers
    eventMarkersRef.current.forEach(m => map.removeLayer(m));
    eventMarkersRef.current = [];

    events.forEach(event => {
      const isExceptional = event.privacy === 'Exceptional';
      const iconHtml = isExceptional 
        ? `<div class="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white shadow-xl flex items-center justify-center animate-bounce text-white"><Sparkles size={16} /></div>`
        : `<div class="w-8 h-8 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white"><Calendar size={14} /></div>`;
      
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
            <h4 class="font-black text-sm mb-1">${event.name}</h4>
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
    // Refresh map markers
    if (userMarkerRef.current) {
      const pos = userMarkerRef.current.getLatLng();
      renderMarkers(pos.lat, pos.lng);
    }
  };

  if (view === 'create-event') {
    return (
      <div className="bg-white min-h-screen p-6 pb-24 overflow-y-auto animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('map')} className="p-2 bg-gray-50 rounded-full">
              <X className="w-6 h-6 text-gray-400" />
            </button>
            <h2 className="text-2xl font-black">Host Event</h2>
          </div>
        </header>

        <form onSubmit={handleCreateEvent} className="space-y-6">
          <div 
            onClick={() => document.getElementById('event-img')?.click()}
            className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 space-y-2 cursor-pointer hover:bg-gray-100 transition-all overflow-hidden"
          >
            {newEvent.image ? (
              <img src={newEvent.image} className="w-full h-full object-cover" />
            ) : (
              <>
                <ImageIcon className="w-10 h-10" />
                <span className="text-sm font-bold uppercase tracking-widest">Event Photo</span>
              </>
            )}
            <input id="event-img" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Event Title</label>
              <input required type="text" placeholder="e.g. Summer Beach Party" className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-purple-200 text-sm font-medium" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date</label>
                <div className="relative">
                  <input required type="date" className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-10 outline-none focus:ring-2 focus:ring-purple-200 text-sm" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                  <Calendar className="absolute left-3 top-4 w-4 h-4 text-purple-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Time</label>
                <div className="relative">
                  <input required type="time" className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-10 outline-none focus:ring-2 focus:ring-purple-200 text-sm" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                  <Clock className="absolute left-3 top-4 w-4 h-4 text-purple-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Privacy Tier</label>
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
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${newEvent.privacy === tier.id ? 'border-purple-500 bg-purple-50' : 'border-gray-100 bg-white'}`}
                  >
                    <tier.icon className={`w-5 h-5 mb-1 ${tier.color}`} />
                    <span className="text-[10px] font-bold">{tier.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs font-bold">Event Location</p>
                  <p className="text-[10px] text-gray-400">{newEvent.coords ? 'Pinned on map' : 'Tap map to set'}</p>
                </div>
              </div>
              {newEvent.coords && <div className="w-2 h-2 bg-green-500 rounded-full" />}
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-purple-200">
            CREATE EVENT
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-120px)] bg-gray-100 overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 z-0 block w-full h-full" />

      <div className="absolute top-4 left-4 right-4 space-y-3 z-10 pointer-events-none">
        <div className="glass rounded-2xl flex items-center px-4 py-2 shadow-xl pointer-events-auto">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input type="text" placeholder="Explore location..." className="bg-transparent border-none outline-none w-full text-sm font-medium" value={address} readOnly />
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <List className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>

        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1 pointer-events-auto">
          {['All', 'Users', 'Products', 'Events', 'Exceptional'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md transition-all ${filter === f ? 'bg-pink-600 text-white' : 'glass text-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => { if (userMarkerRef.current) mapRef.current.setView(userMarkerRef.current.getLatLng(), 16); }} className="absolute bottom-40 right-4 z-10 p-2.5 glass rounded-full shadow-2xl active:scale-95 transition-all text-blue-600">
        <Locate className="w-5 h-5" />
      </button>

      {/* Conditionally display the bottom sheet only when 'Events' is selected - VERY COMPACT VERSION */}
      {filter === 'Events' && (
        <div className="absolute bottom-4 left-4 right-4 z-10 animate-in slide-in-from-bottom duration-300">
          <div className="glass px-3 py-2 rounded-[1.25rem] shadow-2xl border border-white/40 backdrop-blur-2xl">
            <div className="w-6 h-0.5 bg-gray-300 rounded-full mx-auto mb-1.5 opacity-40" />
            
            <div className="flex justify-between items-center mb-1.5">
              <h3 className="text-sm font-black tracking-tight text-gray-900">Events Nearby</h3>
              <button onClick={() => setView('create-event')} className="bg-purple-600 text-white p-1 rounded-lg shadow-md flex items-center space-x-1">
                <Plus className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Host</span>
              </button>
            </div>

            <div className="flex space-x-2.5 overflow-x-auto scrollbar-hide py-0.5">
              {events.map(item => (
                <div key={item.id} className="flex flex-col items-center space-y-0.5 group cursor-pointer flex-shrink-0 w-16">
                  <div className="relative">
                    <img src={item.image || `https://picsum.photos/seed/${item.id}/100/100`} className="w-10 h-10 rounded-lg object-cover ring-1 ring-white shadow-sm transition-transform group-hover:scale-105" />
                    <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-white rounded shadow-xs">
                      {item.privacy === 'Exceptional' ? <Sparkles className="w-2 h-2 text-yellow-500" /> : <Calendar className="w-2 h-2 text-purple-500" />}
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-[7px] font-black text-gray-800 truncate leading-none">{item.name}</p>
                    <p className="text-[6px] text-gray-400 font-bold uppercase tracking-tighter">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-1.5 rounded-lg font-black text-[9px] flex items-center justify-center space-x-1 shadow-md shadow-blue-500/10 transition-all active:scale-95">
              <Navigation className="w-3 h-3 fill-current" />
              <span className="tracking-tighter uppercase">Show on Map</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyTab;
