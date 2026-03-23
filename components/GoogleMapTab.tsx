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
  MapPin, 
  Search, 
  Navigation, 
  Plus, 
  X, 
  Calendar, 
  Clock, 
  Shield, 
  Sparkles, 
  Image as ImageIcon, 
  ChevronLeft, 
  Zap, 
  Target,
  Phone,
  MessageCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { format, differenceInDays, addDays, isWithinInterval, parseISO } from 'date-fns';
import { supabase } from '../src/services/supabaseClient';
import { 
  createEvent, 
  subscribeToEvents, 
  joinEvent, 
  createAccommodation, 
  subscribeToAccommodations,
  createBooking 
} from '../src/services/supabaseService';
import { Event, Accommodation, Booking } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const CENTER = { lat: 37.42, lng: -122.08 };

const GoogleMapTab: React.FC = () => {
  const [view, setView] = useState<'map' | 'create-event' | 'create-accommodation'>('map');
  const [filter, setFilter] = useState('All');
  const [events, setEvents] = useState<Event[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: 'event' | 'accommodation', data: any } | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    const unsubEvents = subscribeToEvents(setEvents);
    const unsubAccs = subscribeToAccommodations(setAccommodations);
    return () => {
      if (typeof unsubEvents === 'function') unsubEvents();
      if (typeof unsubAccs === 'function') unsubAccs();
    };
  }, [isAuthReady, user]);

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] bg-[#0c0c0c] text-white p-8 text-center">
        <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <MapPin className="w-10 h-10 text-pink-500" />
        </div>
        <h2 className="text-2xl font-black mb-4 tracking-tight">Google Maps API Key Required</h2>
        <p className="text-white/60 text-sm mb-8 max-w-xs">
          To enable the interactive map features, please add your Google Maps Platform API key to the project secrets.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left w-full max-w-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-4">Setup Instructions</p>
          <ol className="space-y-3 text-xs text-white/80 list-decimal list-inside">
            <li>Get an API key from Google Cloud Console</li>
            <li>Open Settings (⚙️) → Secrets</li>
            <li>Add <code className="bg-white/10 px-1.5 py-0.5 rounded text-pink-400">GOOGLE_MAPS_PLATFORM_KEY</code></li>
            <li>Paste your key and save</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="relative h-[calc(100vh-120px)] w-full bg-[#0c0c0c] overflow-hidden">
        <Map
          defaultCenter={CENTER}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          disableDefaultUI={true}
          style={{ width: '100%', height: '100%' }}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          <MapContent 
            events={events} 
            accommodations={accommodations} 
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            userLocation={userLocation}
            setRouteInfo={setRouteInfo}
            user={user}
          />
        </Map>

        {/* UI Overlays */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-xl rounded-full flex items-center px-2 py-2 border border-white/10 shadow-2xl pointer-events-auto max-w-lg mx-auto">
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white mr-3 shrink-0 shadow-lg">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search the white canvas..." 
              className="bg-transparent border-none outline-none w-full text-sm font-bold text-white placeholder-white/40" 
            />
          </div>
        </div>

        <div className="absolute top-20 left-4 right-4 z-10 flex space-x-3 overflow-x-auto scrollbar-hide pb-2 px-2 pointer-events-auto">
          {['All', 'Hot Spots', 'Market', 'Events', 'Booking'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] shadow-lg transition-all duration-300 active:scale-95 border ${filter === f ? 'bg-pink-600 text-white border-pink-500' : 'bg-white/5 backdrop-blur-md text-white/80 border-white/10 hover:bg-white/10'}`}
            >
              {f === 'Hot Spots' && <Zap className="w-3 h-3 inline mr-1 mb-0.5" />}
              {f}
            </button>
          ))}
        </div>

        {/* Vibes in Radius Bottom Sheet */}
        <AnimatePresence>
          {view === 'map' && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-6 left-4 right-4 z-10"
            >
              <div className="bg-[#141414]/95 backdrop-blur-2xl px-6 py-6 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-lg mx-auto relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="flex items-center space-x-3">
                     <Target className="w-5 h-5 text-pink-500" />
                     <h3 className="text-sm font-black tracking-[0.1em] text-white uppercase">Vibes in Radius</h3>
                  </div>
                  <button 
                    onClick={() => setView('create-event')} 
                    className="bg-white text-black px-4 py-2 rounded-xl shadow-md flex items-center space-x-2 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Host Now</span>
                  </button>
                </div>

                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2 relative z-10">
                  {events.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedItem({ type: 'event', data: item })}
                      className="flex flex-col items-center space-y-2 group cursor-pointer flex-shrink-0 w-20"
                    >
                      <div className="relative">
                        <img src={item.image || `https://picsum.photos/seed/${item.id}/120/120`} className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10 shadow-lg transition-all group-hover:scale-105" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-800 rounded-full shadow-md flex items-center justify-center border border-white/20">
                          <Calendar className="w-3 h-3 text-pink-500" />
                        </div>
                      </div>
                      <p className="text-[9px] font-black text-white/60 truncate w-full text-center uppercase tracking-tight group-hover:text-pink-500 transition-colors">{item.name}</p>
                    </div>
                  ))}
                  {accommodations.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedItem({ type: 'accommodation', data: item })}
                      className="flex flex-col items-center space-y-2 group cursor-pointer flex-shrink-0 w-20"
                    >
                      <div className="relative">
                        <img src={item.image || `https://picsum.photos/seed/${item.id}/120/120`} className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10 shadow-lg transition-all group-hover:scale-105" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-800 rounded-full shadow-md flex items-center justify-center border border-white/20">
                          <Zap className="w-3 h-3 text-yellow-500" />
                        </div>
                      </div>
                      <p className="text-[9px] font-black text-white/60 truncate w-full text-center uppercase tracking-tight group-hover:text-pink-500 transition-colors">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Event / Accommodation Modals */}
        <AnimatePresence>
          {view !== 'map' && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-50 bg-[#0c0c0c] overflow-y-auto"
            >
              <div className="p-8 pb-32 max-w-lg mx-auto">
                <header className="flex items-center justify-between mb-12">
                  <div className="flex items-center space-x-6">
                    <button onClick={() => setView('map')} className="p-3.5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 active:scale-95 transition-all">
                      <ChevronLeft className="w-7 h-7 text-white" />
                    </button>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      {view === 'create-event' ? 'Host Your Vibe' : 'List Your Space'}
                    </h2>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setView(view === 'create-event' ? 'create-accommodation' : 'create-event')}
                      className="text-[10px] font-black uppercase tracking-widest text-pink-500 bg-pink-500/10 px-4 py-2 rounded-xl border border-pink-500/20"
                    >
                      Switch to {view === 'create-event' ? 'Space' : 'Vibe'}
                    </button>
                  </div>
                </header>

                {view === 'create-event' ? (
                  <EventForm onComplete={() => setView('map')} />
                ) : (
                  <AccommodationForm onComplete={() => setView('map')} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </APIProvider>
  );
};

const MapContent = ({ 
  events, 
  accommodations, 
  selectedItem, 
  setSelectedItem, 
  userLocation,
  setRouteInfo,
  user
}: any) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  const handleItemClick = useCallback((type: 'event' | 'accommodation', data: any) => {
    setSelectedItem({ type, data });
    if (data.location) {
      map?.panTo(data.location);
    }
  }, [map, setSelectedItem]);

  const drawRoute = useCallback(async (destination: google.maps.LatLngLiteral) => {
    if (!routesLib || !map || !userLocation) return;
    
    // Clear previous route
    polylinesRef.current.forEach(p => p.setMap(null));

    try {
      const { routes } = await (routesLib as any).Route.computeRoutes({
        origin: userLocation,
        destination,
        travelMode: 'DRIVING',
        fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
      });

      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => p.setMap(map));
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) map.fitBounds(routes[0].viewport);
        
        const km = (routes[0].distanceMeters / 1000).toFixed(1);
        const mins = Math.round(routes[0].durationMillis / 60000);
        setRouteInfo({ distance: `${km} km`, duration: `${mins} min` });
      }
    } catch (error) {
      console.error('Route error:', error);
    }
  }, [routesLib, map, userLocation, setRouteInfo]);

  return (
    <>
      {userLocation && (
        <AdvancedMarker position={userLocation}>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-blue-500/20 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md z-10"></div>
          </div>
        </AdvancedMarker>
      )}

      {events.map((event: Event) => (
        <AdvancedMarker 
          key={event.id} 
          position={event.location}
          onClick={() => handleItemClick('event', event)}
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-pink-500/20 rounded-full blur-md group-hover:bg-pink-500/40 transition-all duration-300"></div>
            <div className="w-10 h-10 bg-pink-600 rounded-full border-2 border-white shadow-md flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            {user && event.participants.includes(user.id) && (
              <div className="absolute -top-2 -right-2 bg-white text-pink-600 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-pink-100">
                JOINED
              </div>
            )}
          </div>
        </AdvancedMarker>
      ))}

      {accommodations.map((acc: Accommodation) => (
        <AdvancedMarker 
          key={acc.id} 
          position={acc.location}
          onClick={() => handleItemClick('accommodation', acc)}
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-yellow-500/20 rounded-full blur-md group-hover:bg-yellow-500/40 transition-all duration-300"></div>
            <div className="w-10 h-10 bg-yellow-500 rounded-full border-2 border-white shadow-md flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black text-white whitespace-nowrap border border-white/10">
              ${acc.pricePerNight}/night
            </div>
          </div>
        </AdvancedMarker>
      ))}

      {selectedItem && (
        <InfoWindow 
          position={selectedItem.data.location} 
          onCloseClick={() => setSelectedItem(null)}
          className="custom-info-window"
        >
          <div className="p-0 min-w-[240px] bg-[#141414] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl text-white">
            <div className="h-32 w-full bg-zinc-800 relative">
               <img src={selectedItem.data.image || `https://picsum.photos/seed/${selectedItem.data.id}/400/300`} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
               <div className="absolute bottom-3 left-4">
                  <span className="text-[9px] font-black text-pink-500 uppercase tracking-[0.2em] bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
                    {selectedItem.type === 'event' ? selectedItem.data.visibility : 'Accommodation'}
                  </span>
               </div>
            </div>
            <div className="p-5">
              <h4 className="font-black text-[18px] mb-2 text-white tracking-tight leading-none">{selectedItem.data.name}</h4>
              <p className="text-white/40 text-[10px] mb-4 line-clamp-2">{selectedItem.data.description}</p>
              
              {selectedItem.type === 'event' ? (
                <div className="space-y-4">
                  <div className="flex items-center text-[10px] text-white/60 space-x-4">
                    <span className="flex items-center font-bold tracking-widest uppercase">
                      <Calendar className="w-3 h-3 mr-1.5 text-pink-500" />
                      {format(new Date(selectedItem.data.startDate.seconds * 1000), 'MMM d')}
                    </span>
                    <span className="flex items-center font-bold tracking-widest uppercase">
                      <Clock className="w-3 h-3 mr-1.5 text-pink-500" />
                      {selectedItem.data.openingTime}
                    </span>
                  </div>
                  
                  <CountdownTimer targetDate={selectedItem.data.startDate.seconds * 1000} />

                  <button 
                    onClick={() => joinEvent(selectedItem.data.id)}
                    disabled={user && selectedItem.data.participants.includes(user.id)}
                    className="w-full py-3 bg-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-xl hover:shadow-pink-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:bg-zinc-800"
                  >
                    {user && selectedItem.data.participants.includes(user.id) ? 'Joined' : 'Join Vibe'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-white">${selectedItem.data.pricePerNight}<span className="text-[10px] text-white/40 font-normal">/night</span></span>
                    <div className="flex space-x-2">
                      <a href={`tel:${selectedItem.data.phone}`} className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                        <Phone className="w-4 h-4 text-white" />
                      </a>
                      <a href={`https://wa.me/${selectedItem.data.whatsapp}`} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                      </a>
                    </div>
                  </div>

                  <button 
                    onClick={() => drawRoute(selectedItem.data.location)}
                    className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Navigate</span>
                  </button>

                  <BookingForm accommodation={selectedItem.data} onComplete={() => setSelectedItem(null)} />
                </div>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const CountdownTimer = ({ targetDate }: { targetDate: number }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, mins: number, secs: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 flex justify-around items-center">
      <div className="text-center">
        <p className="text-[12px] font-black text-pink-500 leading-none">{timeLeft.days}</p>
        <p className="text-[6px] font-black text-pink-500/60 uppercase tracking-tighter">Days</p>
      </div>
      <div className="text-center">
        <p className="text-[12px] font-black text-pink-500 leading-none">{timeLeft.hours}</p>
        <p className="text-[6px] font-black text-pink-500/60 uppercase tracking-tighter">Hrs</p>
      </div>
      <div className="text-center">
        <p className="text-[12px] font-black text-pink-500 leading-none">{timeLeft.mins}</p>
        <p className="text-[6px] font-black text-pink-500/60 uppercase tracking-tighter">Min</p>
      </div>
      <div className="text-center">
        <p className="text-[12px] font-black text-pink-500 leading-none">{timeLeft.secs}</p>
        <p className="text-[6px] font-black text-pink-500/60 uppercase tracking-tighter">Sec</p>
      </div>
    </div>
  );
};

const EventForm = ({ onComplete }: { onComplete: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    openingTime: '',
    visibility: 'public' as 'public' | 'private',
    participation: 'free' as 'free' | 'paid',
    price: 0,
    image: '',
    location: CENTER
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent(formData as any);
      onComplete();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 focus-within:border-pink-500/50 transition-all">
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Vibe Name</label>
          <input 
            required 
            type="text" 
            placeholder="Neon Rooftop Party" 
            className="w-full bg-transparent border-none p-0 outline-none text-xl font-black text-white placeholder-white/10" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>

        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Description</label>
          <textarea 
            required 
            placeholder="Tell us about the vibe..." 
            className="w-full bg-transparent border-none p-0 outline-none text-sm font-bold text-white placeholder-white/10 min-h-[100px] resize-none" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Start Date</label>
            <input 
              required 
              type="date" 
              className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-white" 
              value={formData.startDate} 
              onChange={e => setFormData({...formData, startDate: e.target.value})} 
            />
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">End Date</label>
            <input 
              required 
              type="date" 
              className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-white" 
              value={formData.endDate} 
              onChange={e => setFormData({...formData, endDate: e.target.value})} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Opening Time</label>
            <input 
              required 
              type="time" 
              className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-white" 
              value={formData.openingTime} 
              onChange={e => setFormData({...formData, openingTime: e.target.value})} 
            />
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Image URL</label>
            <input 
              type="url" 
              placeholder="https://..." 
              className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-white" 
              value={formData.image} 
              onChange={e => setFormData({...formData, image: e.target.value})} 
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            type="button"
            onClick={() => setFormData({...formData, visibility: 'public'})}
            className={`flex-1 py-4 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${formData.visibility === 'public' ? 'border-pink-500 bg-pink-500/10 text-white' : 'border-white/5 bg-white/5 text-white/40'}`}
          >
            Public
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, visibility: 'private'})}
            className={`flex-1 py-4 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${formData.visibility === 'private' ? 'border-pink-500 bg-pink-500/10 text-white' : 'border-white/5 bg-white/5 text-white/40'}`}
          >
            Private
          </button>
        </div>

        <div className="flex space-x-4">
          <button 
            type="button"
            onClick={() => setFormData({...formData, participation: 'free'})}
            className={`flex-1 py-4 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${formData.participation === 'free' ? 'border-pink-500 bg-pink-500/10 text-white' : 'border-white/5 bg-white/5 text-white/40'}`}
          >
            Free
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, participation: 'paid'})}
            className={`flex-1 py-4 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${formData.participation === 'paid' ? 'border-pink-500 bg-pink-500/10 text-white' : 'border-white/5 bg-white/5 text-white/40'}`}
          >
            Paid
          </button>
        </div>

        {formData.participation === 'paid' && (
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Price ($)</label>
            <input 
              required 
              type="number" 
              className="w-full bg-transparent border-none p-0 outline-none text-xl font-black text-white" 
              value={formData.price} 
              onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
            />
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-pink-600 text-white py-6 rounded-[2.5rem] font-black text-lg shadow-xl hover:shadow-pink-500/20 active:scale-[0.98] transition-all tracking-[0.3em] uppercase flex items-center justify-center"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Launch Vibe'}
      </button>
    </form>
  );
};

const AccommodationForm = ({ onComplete }: { onComplete: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: 0,
    whatsapp: '',
    phone: '',
    image: '',
    location: CENTER
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAccommodation(formData as any);
      onComplete();
    } catch (error) {
      console.error('Error creating accommodation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 focus-within:border-yellow-500/50 transition-all">
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Property Name</label>
          <input 
            required 
            type="text" 
            placeholder="Modern Studio in Downtown" 
            className="w-full bg-transparent border-none p-0 outline-none text-xl font-black text-white placeholder-white/10" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>

        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Description</label>
          <textarea 
            required 
            placeholder="Describe your space..." 
            className="w-full bg-transparent border-none p-0 outline-none text-sm font-bold text-white placeholder-white/10 min-h-[100px] resize-none" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Price / Night ($)</label>
            <input 
              required 
              type="number" 
              className="w-full bg-transparent border-none p-0 outline-none text-xl font-black text-white" 
              value={formData.pricePerNight} 
              onChange={e => setFormData({...formData, pricePerNight: Number(e.target.value)})} 
            />
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Image URL</label>
            <input 
              type="url" 
              placeholder="https://..." 
              className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-white" 
              value={formData.image} 
              onChange={e => setFormData({...formData, image: e.target.value})} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">WhatsApp</label>
            <input 
              required 
              type="tel" 
              placeholder="+1..." 
              className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-white" 
              value={formData.whatsapp} 
              onChange={e => setFormData({...formData, whatsapp: e.target.value})} 
            />
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Phone</label>
            <input 
              required 
              type="tel" 
              placeholder="+1..." 
              className="w-full bg-transparent border-none p-0 outline-none text-sm font-black text-white" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-yellow-500 text-black py-6 rounded-[2.5rem] font-black text-lg shadow-xl hover:shadow-yellow-500/20 active:scale-[0.98] transition-all tracking-[0.3em] uppercase flex items-center justify-center"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'List Space'}
      </button>
    </form>
  );
};

const BookingForm = ({ accommodation, onComplete }: { accommodation: Accommodation, onComplete: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (dates.checkIn && dates.checkOut) {
      const days = differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn));
      if (days > 0) {
        setTotalCost(days * accommodation.pricePerNight);
      } else {
        setTotalCost(0);
      }
    }
  }, [dates, accommodation.pricePerNight]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalCost <= 0) return;
    setLoading(true);
    try {
      await createBooking({
        accommodationId: accommodation.id,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        totalCost,
      } as any);
      onComplete();
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="space-y-4 pt-4 border-t border-white/10">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
          <label className="block text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Check In</label>
          <input 
            required 
            type="date" 
            className="w-full bg-transparent border-none p-0 outline-none text-[10px] font-black text-white" 
            value={dates.checkIn} 
            onChange={e => setDates({...dates, checkIn: e.target.value})} 
          />
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
          <label className="block text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Check Out</label>
          <input 
            required 
            type="date" 
            className="w-full bg-transparent border-none p-0 outline-none text-[10px] font-black text-white" 
            value={dates.checkOut} 
            onChange={e => setDates({...dates, checkOut: e.target.value})} 
          />
        </div>
      </div>

      {totalCost > 0 && (
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Cost</span>
          <span className="text-sm font-black text-white">${totalCost}</span>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading || totalCost <= 0}
        className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm Booking'}
      </button>
    </form>
  );
};

export default GoogleMapTab;
