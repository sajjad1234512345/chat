
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap, 
  useMapsLibrary,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Lock, 
  Unlock, 
  DollarSign, 
  Navigation, 
  Phone, 
  MessageCircle, 
  X, 
  Camera,
  Search,
  ChevronLeft,
  Calendar as CalendarIcon,
  Info,
  Target,
  Flame,
  ShoppingBag
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  updateDoc, 
  doc, 
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { format, differenceInDays, intervalToDuration, isAfter, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants & Types ---

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface EventData {
  id: string;
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  openingTime: string;
  location: { lat: number; lng: number };
  visibility: 'public' | 'private';
  type: 'free' | 'paid';
  price?: number;
  creatorId: string;
  participants: string[];
}

interface AccommodationData {
  id: string;
  name: string;
  description: string;
  location: { lat: number; lng: number };
  pricePerNight: number;
  availableDays: string[];
  bookedDays: string[];
  whatsapp: string;
  phone: string;
  hostId: string;
}

// --- Components ---

const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const target = parseISO(targetDate);
    const interval = setInterval(() => {
      const now = new Date();
      if (isAfter(now, target)) {
        setTimeLeft('Started!');
        clearInterval(interval);
        return;
      }
      const duration = intervalToDuration({ start: now, end: target });
      setTimeLeft(`${duration.days || 0}d ${duration.hours || 0}h ${duration.minutes || 0}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="text-[10px] font-black">{timeLeft}</span>;
};

const RouteDisplay: React.FC<{ origin: any; destination: any }> = ({ origin, destination }) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;
    
    // Clear previous route
    polylinesRef.current.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => p.setMap(map));
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) map.fitBounds(routes[0].viewport);
      }
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin, destination]);

  return null;
};

const EventsTab: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationData[]>([]);
  const [view, setView] = useState<'map' | 'create-event' | 'create-acc'>('map');
  const [selectedItem, setSelectedItem] = useState<{ type: 'event' | 'acc', data: any } | null>(null);
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const [showRoute, setShowRoute] = useState(false);

  // Form States
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    image: 'https://picsum.photos/seed/event/800/400',
    startDate: '',
    endDate: '',
    openingTime: '12:00',
    visibility: 'public' as 'public' | 'private',
    type: 'free' as 'free' | 'paid',
    price: 0,
    location: null as any | null
  });

  const [accForm, setAccForm] = useState({
    name: '',
    description: '',
    pricePerNight: 0,
    whatsapp: '',
    phone: '',
    location: null as any | null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 37.7749, lng: -122.4194 }) // Fallback to SF
      );
    }
  }, []);

  useEffect(() => {
    const qEvents = query(collection(db, 'events'));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData)));
    });

    const qAccs = query(collection(db, 'accommodations'));
    const unsubAccs = onSnapshot(qAccs, (snapshot) => {
      setAccommodations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AccommodationData)));
    });

    return () => { unsubEvents(); unsubAccs(); };
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !eventForm.location) return;
    try {
      await addDoc(collection(db, 'events'), {
        ...eventForm,
        creatorId: user.uid,
        participants: [user.uid],
        createdAt: Timestamp.now()
      });
      setView('map');
      setEventForm({ name: '', description: '', image: 'https://picsum.photos/seed/event/800/400', startDate: '', endDate: '', openingTime: '12:00', visibility: 'public', type: 'free', price: 0, location: null });
    } catch (err) { console.error(err); }
  };

  const handleCreateAcc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accForm.location) return;
    try {
      await addDoc(collection(db, 'accommodations'), {
        ...accForm,
        hostId: user.uid,
        availableDays: [],
        bookedDays: [],
        createdAt: Timestamp.now()
      });
      setView('map');
      setAccForm({ name: '', description: '', pricePerNight: 0, whatsapp: '', phone: '', location: null });
    } catch (err) { console.error(err); }
  };

  const joinEvent = async (eventId: string) => {
    if (!user) return;
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      participants: arrayUnion(user.uid)
    });
  };

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0c0c0c] text-white p-8 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <MapPin className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-2xl font-black mb-4">Google Maps API Key Required</h2>
        <p className="text-white/40 text-sm mb-8 max-w-xs">To enable the interactive map, please add your Google Maps API key to the project secrets.</p>
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-left w-full max-w-md">
          <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4">Setup Instructions</p>
          <ol className="space-y-3 text-xs text-white/60 list-decimal pl-4">
            <li>Get an API key from Google Cloud Console</li>
            <li>Open Settings (⚙️) → Secrets</li>
            <li>Add <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-[#0c0c0c] overflow-hidden">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={userLocation || { lat: 37.7749, lng: -122.4194 }}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          className="w-full h-full"
          disableDefaultUI={true}
          onClick={(e) => {
            if (view === 'create-event') setEventForm({ ...eventForm, location: e.detail.latLng });
            if (view === 'create-acc') setAccForm({ ...accForm, location: e.detail.latLng });
          }}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          {/* Event Markers */}
          {events.map(event => (
            <AdvancedMarker 
              key={event.id} 
              position={event.location}
              onClick={() => {
                setSelectedItem({ type: 'event', data: event });
                setShowRoute(false);
              }}
            >
              <div className="relative group">
                <div className="bg-[#e91e63] p-2.5 rounded-full shadow-[0_0_15px_rgba(233,30,99,0.5)] border-2 border-white transform transition-transform group-hover:scale-110">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                {event.participants.includes(user?.uid) && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 whitespace-nowrap">
                    <CountdownTimer targetDate={event.startDate} />
                  </div>
                )}
              </div>
            </AdvancedMarker>
          ))}

          {/* Accommodation Markers */}
          {accommodations.map(acc => (
            <AdvancedMarker 
              key={acc.id} 
              position={acc.location}
              onClick={() => {
                setSelectedItem({ type: 'acc', data: acc });
                setShowRoute(false);
              }}
            >
              <div className="bg-[#e91e63] p-2.5 rounded-full shadow-[0_0_15px_rgba(233,30,99,0.5)] border-2 border-white transform transition-transform hover:scale-110">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
            </AdvancedMarker>
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse" />
            </AdvancedMarker>
          )}

          {/* Navigation Route */}
          {showRoute && userLocation && selectedItem?.type === 'acc' && (
            <RouteDisplay origin={userLocation} destination={selectedItem.data.location} />
          )}
        </Map>

        {/* UI Overlays */}
        <div className="absolute top-6 left-6 right-6 z-10 space-y-4 pointer-events-none">
          {/* Search Bar */}
          <div className="w-full bg-white rounded-full shadow-2xl flex items-center px-4 py-3 border border-white/20 pointer-events-auto">
            <div className="w-10 h-10 bg-[#e91e63] rounded-full flex items-center justify-center mr-3 shadow-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <input 
              type="text" 
              placeholder="Search the white canvas..." 
              className="bg-transparent border-none outline-none text-black font-bold text-sm flex-1 placeholder-black/40"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2 pointer-events-auto">
            <button className="flex-1 bg-[#2a2a2a] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl border border-white/5">
              All
            </button>
            <button className="flex-1 bg-[#2a2a2a] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl border border-white/5 flex items-center justify-center space-x-1">
              <Plus className="w-3 h-3" />
              <span>Hot Spots</span>
            </button>
            <button className="flex-1 bg-[#e91e63] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl border border-white/5">
              Market
            </button>
          </div>
        </div>

        {/* Bottom Sheet: Vibes in Radius */}
        <div className="absolute bottom-6 left-4 right-4 z-10 pointer-events-none">
          <div className="bg-[#1a1a1a] rounded-[2.5rem] p-6 shadow-2xl border border-white/10 pointer-events-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#e91e63]/20 rounded-full flex items-center justify-center border border-[#e91e63]/30">
                  <Target className="w-5 h-5 text-[#e91e63]" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Vibes in Radius</h2>
              </div>
              <button 
                onClick={() => setView('create-event')}
                className="bg-white text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Host Now</span>
              </button>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {events.length > 0 ? events.map(event => (
                <div 
                  key={event.id} 
                  onClick={() => setSelectedItem({ type: 'event', data: event })}
                  className="flex-shrink-0 w-24 space-y-2 group cursor-pointer"
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#e91e63] transition-colors">
                    <img src={event.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-1 right-1 bg-[#e91e63] p-1 rounded-full border border-white/20">
                      <CalendarIcon className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <p className="text-[9px] font-black text-white text-center uppercase truncate px-1">{event.name}</p>
                </div>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center py-4 text-white/20">
                  <Flame className="w-8 h-8 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No vibes nearby</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Creation Instructions Overlay */}
        {(view === 'create-event' || view === 'create-acc') && !eventForm.location && !accForm.location && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 animate-bounce">
            <p className="text-xs font-bold text-white">Tap on the map to set location</p>
          </div>
        )}

        {/* Detail Panels */}
        {selectedItem && (
          <div className="absolute bottom-24 left-6 right-6 z-20 bg-[#0c0c0c]/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom duration-500 max-h-[70vh] overflow-y-auto scrollbar-hide">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-white/40"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedItem.type === 'event' ? (
              <div className="space-y-6">
                <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10">
                  <img src={selectedItem.data.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black text-white">{selectedItem.data.name}</h2>
                    <div className="flex items-center space-x-2 bg-blue-600/20 px-3 py-1 rounded-full border border-blue-500/20">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <CountdownTimer targetDate={selectedItem.data.startDate} />
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{selectedItem.data.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Starts</p>
                    <p className="text-xs font-bold text-white">{format(parseISO(selectedItem.data.startDate), 'MMM d, yyyy')}</p>
                    <p className="text-[10px] text-white/40">{selectedItem.data.openingTime}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-xs font-bold text-white">{differenceInDays(parseISO(selectedItem.data.endDate), parseISO(selectedItem.data.startDate))} Days</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                      {selectedItem.data.visibility === 'public' ? <Unlock className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5 text-red-500" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white capitalize">{selectedItem.data.visibility} Event</p>
                      <p className="text-[10px] text-white/40">{selectedItem.data.type === 'free' ? 'Free Admission' : `$${selectedItem.data.price} Entry`}</p>
                    </div>
                  </div>
                  {!selectedItem.data.participants.includes(user?.uid) ? (
                    <button 
                      onClick={() => joinEvent(selectedItem.data.id)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-xs active:scale-95 transition-all"
                    >
                      JOIN EVENT
                    </button>
                  ) : (
                    <div className="bg-green-500/20 px-4 py-2 rounded-xl border border-green-500/20">
                      <span className="text-green-500 text-[10px] font-black">JOINED</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-white/10" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black text-white">{selectedItem.data.name || 'Rental Property'}</h2>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-500">${selectedItem.data.pricePerNight}</p>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">per night</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{selectedItem.data.description || 'No description provided.'}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setShowRoute(true)}
                    className="flex flex-col items-center justify-center bg-blue-600/10 border border-blue-500/20 p-4 rounded-3xl space-y-2 active:scale-95 transition-all"
                  >
                    <Navigation className="w-6 h-6 text-blue-500" />
                    <span className="text-[9px] font-black text-blue-500 uppercase">Route</span>
                  </button>
                  <a 
                    href={`https://wa.me/${selectedItem.data.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center bg-emerald-600/10 border border-emerald-500/20 p-4 rounded-3xl space-y-2 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-6 h-6 text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase">WhatsApp</span>
                  </a>
                  <a 
                    href={`tel:${selectedItem.data.phone}`}
                    className="flex flex-col items-center justify-center bg-orange-600/10 border border-orange-500/20 p-4 rounded-3xl space-y-2 active:scale-95 transition-all"
                  >
                    <Phone className="w-6 h-6 text-orange-500" />
                    <span className="text-[9px] font-black text-orange-500 uppercase">Call</span>
                  </a>
                </div>

                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Availability</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Creation Forms */}
        {view === 'create-event' && eventForm.location && (
          <div className="absolute inset-0 z-50 bg-[#0c0c0c] p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <header className="flex items-center justify-between mb-8">
              <button onClick={() => setView('map')} className="p-2 bg-white/5 rounded-full">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-xl font-black text-white">Create Event</h2>
              <div className="w-10" />
            </header>

            <form onSubmit={handleCreateEvent} className="space-y-6 pb-12">
              <div className="w-full aspect-video bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 space-y-2">
                <Camera className="w-10 h-10" />
                <span className="text-xs font-black uppercase tracking-widest">Upload Cover Photo</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Event Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-colors"
                    value={eventForm.name}
                    onChange={e => setEventForm({...eventForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-colors"
                    value={eventForm.description}
                    onChange={e => setEventForm({...eventForm, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Start Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-colors"
                      value={eventForm.startDate}
                      onChange={e => setEventForm({...eventForm, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">End Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-colors"
                      value={eventForm.endDate}
                      onChange={e => setEventForm({...eventForm, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Opening Time</label>
                    <input 
                      type="time" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-colors"
                      value={eventForm.openingTime}
                      onChange={e => setEventForm({...eventForm, openingTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Visibility</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-colors appearance-none"
                      value={eventForm.visibility}
                      onChange={e => setEventForm({...eventForm, visibility: e.target.value as any})}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all">
                LAUNCH EVENT
              </button>
            </form>
          </div>
        )}

        {view === 'create-acc' && accForm.location && (
          <div className="absolute inset-0 z-50 bg-[#0c0c0c] p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <header className="flex items-center justify-between mb-8">
              <button onClick={() => setView('map')} className="p-2 bg-white/5 rounded-full">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-xl font-black text-white">List Property</h2>
              <div className="w-10" />
            </header>

            <form onSubmit={handleCreateAcc} className="space-y-6 pb-12">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Property Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-colors"
                    value={accForm.name}
                    onChange={e => setAccForm({...accForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Price per Night ($)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-colors"
                    value={accForm.pricePerNight}
                    onChange={e => setAccForm({...accForm, pricePerNight: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="e.g. 1234567890"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-colors"
                      value={accForm.whatsapp}
                      onChange={e => setAccForm({...accForm, whatsapp: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Phone</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-colors"
                      value={accForm.phone}
                      onChange={e => setAccForm({...accForm, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all">
                LIST PROPERTY
              </button>
            </form>
          </div>
        )}
      </APIProvider>
    </div>
  );
};

export default EventsTab;
