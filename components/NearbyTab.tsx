
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Search, Navigation, Users, Store, Calendar, Filter, List, Locate, Plus, X, Camera, Clock, Shield, Sparkles, Image as ImageIcon, ChevronLeft, Zap, Target, Phone, MessageCircle } from 'lucide-react';
import { mockEvents, mockHousing, Event, Housing } from '../src/constants';

type SearchResult = {
  id: string;
  type: 'event' | 'housing' | 'place';
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
  data?: any;
};

const NearbyTab: React.FC = () => {
  const [view, setView] = useState<'map' | 'create-event' | 'create-housing' | 'housing-details'>('map');
  const [filter, setFilter] = useState<'All' | 'Events' | 'Housing'>('All');
  const [selectedHousing, setSelectedHousing] = useState<Housing | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const eventMarkersRef = useRef<L.Marker[]>([]);
  const housingMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [address, setAddress] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  useEffect(() => {
    if (searchQuery.length < 1) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    
    // Get user location for distance sorting if available
    let userLat = 0;
    let userLng = 0;
    if (userMarkerRef.current) {
      const latLng = userMarkerRef.current.getLatLng();
      userLat = latLng.lat;
      userLng = latLng.lng;
    }

    // Search Events
    mockEvents.forEach(event => {
      if (event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query)) {
        results.push({
          id: `event-${event.id}`,
          type: 'event',
          title: event.title,
          subtitle: 'Event',
          lat: event.lat,
          lng: event.lng,
          data: event
        });
      }
    });

    // Search Housing
    mockHousing.forEach(housing => {
      if (housing.title?.toLowerCase().includes(query)) {
        results.push({
          id: `housing-${housing.id}`,
          type: 'housing',
          title: housing.title,
          subtitle: `Housing - $${housing.pricePerNight}/night`,
          lat: housing.lat,
          lng: housing.lng,
          data: housing
        });
      }
    });

    // Sort by distance if user location is known
    if (userLat !== 0 && userLng !== 0) {
      results.sort((a, b) => {
        const distA = calculateDistance(userLat, userLng, a.lat, a.lng);
        const distB = calculateDistance(userLat, userLng, b.lat, b.lng);
        return distA - distB;
      });
    }

    setSearchResults(results);
    setShowResults(true);

    // Optional: Fetch real places from Nominatim API if no local results or just to augment
    if (query.length > 2) {
      setIsSearching(true);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          const placeResults: SearchResult[] = data.map((item: any) => ({
            id: `place-${item.place_id}`,
            type: 'place',
            title: item.display_name.split(',')[0],
            subtitle: item.display_name.split(',').slice(1).join(',').trim(),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          }));
          
          setSearchResults(prev => {
            // Combine and deduplicate
            const combined = [...prev, ...placeResults];
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
            return unique;
          });
        })
        .catch(err => console.error("Error fetching places:", err))
        .finally(() => setIsSearching(false));
    }

  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery(result.title);
    
    if (mapRef.current) {
      mapRef.current.setView([result.lat, result.lng], 16);
      
      // If it's housing, open the details
      if (result.type === 'housing') {
        setSelectedHousing(result.data);
        setView('housing-details');
      }
    }
  };

  const initMap = () => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, { 
      zoomControl: false, 
      attributionControl: false,
    }).setView([37.422, -122.084], 15);
    
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { 
      maxZoom: 20,
    }).addTo(map);

    renderMarkers();
  };

  const renderMarkers = () => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    eventMarkersRef.current.forEach(m => m.remove());
    housingMarkersRef.current.forEach(m => m.remove());
    eventMarkersRef.current = [];
    housingMarkersRef.current = [];

    // Render Events
    if (filter === 'All' || filter === 'Events') {
      mockEvents.forEach(event => {
        const icon = L.divIcon({
          html: `<div class="group relative">
                  <div class="absolute -inset-2 bg-pink-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="relative w-10 h-10 bg-pink-600 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center text-white transform transition-all hover:scale-110 hover:-translate-y-1">
                    <span class="text-[10px] font-black italic">EVT</span>
                  </div>
                </div>`,
          className: 'event-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
        const marker = L.marker([event.lat, event.lng], { icon }).addTo(map);
        eventMarkersRef.current.push(marker);
      });
    }

    // Render Housing
    if (filter === 'All' || filter === 'Housing') {
      mockHousing.forEach(housing => {
        const icon = L.divIcon({
          html: `<div class="group relative">
                  <div class="absolute -inset-2 bg-blue-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="relative w-10 h-10 bg-blue-600 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center text-white transform transition-all hover:scale-110 hover:-translate-y-1">
                    <span class="text-[10px] font-black italic">$${housing.pricePerNight}</span>
                  </div>
                </div>`,
          className: 'housing-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
        const marker = L.marker([housing.lat, housing.lng], { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedHousing(housing);
          setView('housing-details');
        });
        housingMarkersRef.current.push(marker);
      });
    }
  };

  useEffect(() => {
    initMap();
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 14);
            
            const userIcon = L.divIcon({
              html: `<div class="relative">
                      <div class="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping"></div>
                      <div class="absolute -inset-2 bg-blue-500/40 rounded-full animate-pulse"></div>
                      <div class="relative w-6 h-6 bg-white rounded-full border-[3px] border-blue-600 shadow-2xl flex items-center justify-center">
                        <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>`,
              className: 'user-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });
            
            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng([latitude, longitude]);
            } else {
              userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(mapRef.current);
            }
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    renderMarkers();
  }, [filter]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save event (mocked)
    setView('map');
  };

  const handleCreateHousing = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save housing (mocked)
    setView('map');
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current?.setView([latitude, longitude], 14);
          
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="relative flex flex-col flex-grow w-full bg-[#0c0c0c] overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 z-0 block w-full h-full grayscale invert opacity-80" />

      {/* Search Bar */}
      <div className="absolute top-6 left-6 right-20 z-20">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/40" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-12 py-4 border-none rounded-[1.8rem] leading-5 bg-[#1a1a1a]/90 backdrop-blur-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 sm:text-sm transition-all shadow-2xl italic font-black uppercase tracking-widest"
              placeholder="Explore nearby..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.length > 0) setShowResults(true);
              }}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-5 flex items-center"
                onClick={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
              >
                <X className="h-5 w-5 text-white/40 hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-4 w-full bg-[#1a1a1a]/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden max-h-80 overflow-y-auto border border-white/10 animate-in slide-in-from-top-4 duration-500">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="px-6 py-5 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex items-center space-x-5 transition-colors group"
                onClick={() => handleResultClick(result)}
              >
                <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${
                  result.type === 'event' ? 'bg-pink-500/20 text-pink-500' : 
                  result.type === 'housing' ? 'bg-blue-500/20 text-blue-500' : 
                  'bg-white/10 text-white/60'
                }`}>
                  {result.type === 'event' && <Calendar className="w-5 h-5" />}
                  {result.type === 'housing' && <Store className="w-5 h-5" />}
                  {result.type === 'place' && <MapPin className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-black text-white truncate uppercase italic tracking-tight">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-[10px] text-white/30 truncate uppercase tracking-[0.2em] mt-1 italic">{result.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
            {isSearching && (
              <div className="px-6 py-4 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">
                Scanning coordinates...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter UI */}
      <div className="absolute top-24 left-6 z-10 flex space-x-3">
        {(['All', 'Events', 'Housing'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-90 italic border ${filter === f ? 'bg-white text-black border-white' : 'bg-[#1a1a1a]/80 backdrop-blur-xl text-white/40 border-white/10 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Locate Me Button */}
      <button 
        onClick={handleLocateMe}
        className="absolute top-6 right-6 z-10 bg-[#1a1a1a]/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl text-white/40 hover:text-white active:scale-90 transition-all border border-white/10"
      >
        <Locate className="w-6 h-6" />
      </button>

      {/* Add Buttons */}
      <div className="absolute bottom-24 left-6 z-10 flex flex-col space-y-3">
        <button onClick={() => setView('create-event')} className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 italic border border-pink-500/20">Host Event</button>
        <button onClick={() => setView('create-housing')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 italic border border-blue-500/20">Add Housing</button>
      </div>

      {/* Housing Details Drawer */}
      {view === 'housing-details' && selectedHousing && (
        <div className="absolute inset-x-0 bottom-0 top-20 z-50 bg-[#0c0c0c]/95 backdrop-blur-3xl rounded-t-[4rem] p-10 shadow-[0_-50px_100px_rgba(0,0,0,0.8)] border-t border-white/10 animate-in slide-in-from-bottom-full duration-700">
          <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">{selectedHousing.title}</h2>
              <p className="text-2xl font-black text-pink-500 mt-4 italic tracking-tight">${selectedHousing.pricePerNight} <span className="text-white/30 text-sm uppercase tracking-widest">/ night</span></p>
            </div>
            <button onClick={() => setView('map')} className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors border border-white/10">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-12">
            <a href={`https://wa.me/${selectedHousing.whatsappNumber}`} className="bg-[#25D366] text-white py-5 rounded-[2rem] flex flex-col items-center justify-center space-y-3 shadow-2xl active:scale-95 transition-all group">
              <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" /> 
              <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">WhatsApp</span>
            </a>
            <a href={`tel:${selectedHousing.phoneNumber}`} className="bg-blue-600 text-white py-5 rounded-[2rem] flex flex-col items-center justify-center space-y-3 shadow-2xl active:scale-95 transition-all group">
              <Phone className="w-8 h-8 group-hover:scale-110 transition-transform" /> 
              <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Call Now</span>
            </a>
          </div>

          <div className="mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
             <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-4 italic">Description</h4>
             <p className="text-white/60 text-sm leading-relaxed italic">Premium accommodation in the heart of the city. Fully furnished with high-speed internet and modern amenities.</p>
          </div>
        </div>
      )}

      {/* Create Event Form */}
      {view === 'create-event' && (
        <div className="absolute inset-0 z-50 bg-[#0c0c0c] p-10 overflow-y-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Host Event</h2>
            <button onClick={() => setView('map')} className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors border border-white/10">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleCreateEvent} className="space-y-8 max-w-md mx-auto">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic ml-4">Event Name</label>
              <input type="text" placeholder="Vibrant Night..." className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder-white/20 focus:ring-2 focus:ring-pink-500/50 outline-none italic font-black uppercase tracking-widest" required />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic ml-4">Event Date</label>
              <input type="date" className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder-white/20 focus:ring-2 focus:ring-pink-500/50 outline-none italic font-black uppercase tracking-widest" required />
            </div>
            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95 italic mt-8">Launch Event</button>
          </form>
        </div>
      )}

      {/* Create Housing Form */}
      {view === 'create-housing' && (
        <div className="absolute inset-0 z-50 bg-[#0c0c0c] p-10 overflow-y-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Add Housing</h2>
            <button onClick={() => setView('map')} className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors border border-white/10">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleCreateHousing} className="space-y-8 max-w-md mx-auto">
             <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic ml-4">Property Title</label>
              <input type="text" placeholder="Modern Loft..." className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none italic font-black uppercase tracking-widest" required />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic ml-4">Price Per Night</label>
              <input type="number" placeholder="150" className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none italic font-black uppercase tracking-widest" required />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic ml-4">WhatsApp Contact</label>
              <input type="text" placeholder="+1..." className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none italic font-black uppercase tracking-widest" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95 italic mt-8">List Property</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NearbyTab;
