
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Search, Navigation, Users, Store, Calendar, Filter, List, Locate, Plus, X, Camera, Clock, Shield, Sparkles, Image as ImageIcon, ChevronLeft, Zap, Target, Phone, MessageCircle, UserPlus, Eye, MoreVertical } from 'lucide-react';
import { mockEvents, mockHousing, Event, Housing } from '../src/constants';

type NearbyPerson = {
  id: string;
  name: string;
  avatar: string;
  distance: number;
  bio: string;
  isFriend: boolean;
  lastSeen: string;
  lat: number;
  lng: number;
};

const mockPeople: NearbyPerson[] = [
  { id: 'p1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', distance: 0.3, bio: 'Love exploring local cafes!', isFriend: false, lastSeen: '2 mins ago', lat: 37.423, lng: -122.085 },
  { id: 'p2', name: 'Marcus Wright', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', distance: 0.8, bio: 'Photography & Hiking', isFriend: true, lastSeen: '5 mins ago', lat: 37.421, lng: -122.082 },
  { id: 'p3', name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', distance: 1.2, bio: 'Digital nomad from Spain', isFriend: false, lastSeen: '12 mins ago', lat: 37.425, lng: -122.088 },
  { id: 'p4', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', distance: 1.5, bio: 'Tech enthusiast', isFriend: false, lastSeen: '15 mins ago', lat: 37.419, lng: -122.080 },
  { id: 'p5', name: 'Jessica Lee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', distance: 2.1, bio: 'Foodie & Traveler', isFriend: true, lastSeen: '30 mins ago', lat: 37.428, lng: -122.090 },
];

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
  const [view, setView] = useState<'map' | 'create-event' | 'create-housing' | 'housing-details' | 'people-nearby'>('map');
  const [filter, setFilter] = useState<'All' | 'Events' | 'Housing'>('All');
  const [selectedHousing, setSelectedHousing] = useState<Housing | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const eventMarkersRef = useRef<L.Marker[]>([]);
  const housingMarkersRef = useRef<L.Marker[]>([]);
  const peopleMarkersRef = useRef<L.Marker[]>([]);
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
    peopleMarkersRef.current.forEach(m => m.remove());
    eventMarkersRef.current = [];
    housingMarkersRef.current = [];
    peopleMarkersRef.current = [];

    // Render Events
    if (filter === 'All' || filter === 'Events') {
      mockEvents.forEach(event => {
        const icon = L.divIcon({
          html: `<div class="w-8 h-8 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold shadow-lg">E</div>`,
          className: 'event-marker',
          iconSize: [32, 32],
        });
        const marker = L.marker([event.lat, event.lng], { icon }).addTo(map);
        eventMarkersRef.current.push(marker);
      });
    }

    // Render Housing
    if (filter === 'All' || filter === 'Housing') {
      mockHousing.forEach(housing => {
        const icon = L.divIcon({
          html: `<div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold shadow-lg">H</div>`,
          className: 'housing-marker',
          iconSize: [32, 32],
        });
        const marker = L.marker([housing.lat, housing.lng], { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedHousing(housing);
          setView('housing-details');
        });
        housingMarkersRef.current.push(marker);
      });
    }

    // Render People Nearby
    mockPeople.forEach(person => {
      const icon = L.divIcon({
        html: `
          <div class="relative group">
            <div class="w-10 h-10 rounded-full border-2 border-white shadow-xl overflow-hidden bg-zinc-800">
              <img src="${person.avatar}" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        `,
        className: 'person-marker',
        iconSize: [40, 40],
      });
      const marker = L.marker([person.lat, person.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div class="p-2 text-zinc-900">
          <p class="font-black text-sm">${person.name}</p>
          <p class="text-[10px] text-zinc-500">${person.distance}km away</p>
        </div>
      `);
      peopleMarkersRef.current.push(marker);
    });
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
              html: `<div class="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] flex items-center justify-center animate-pulse"></div>`,
              className: 'user-marker',
              iconSize: [20, 20],
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
    <div className="relative flex flex-col flex-grow w-full bg-[#f8f9fa] overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 z-0 block w-full h-full" />

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-16 z-20">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-3 border border-transparent rounded-2xl leading-5 bg-white shadow-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm transition-all"
            placeholder="Search places, events, housing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.length > 0) setShowResults(true);
            }}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => {
                setSearchQuery('');
                setShowResults(false);
              }}
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto border border-gray-100">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center space-x-3"
                onClick={() => handleResultClick(result)}
              >
                <div className={`p-2 rounded-full ${
                  result.type === 'event' ? 'bg-pink-100 text-pink-600' : 
                  result.type === 'housing' ? 'bg-blue-100 text-blue-600' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {result.type === 'event' && <Calendar className="w-4 h-4" />}
                  {result.type === 'housing' && <Store className="w-4 h-4" />}
                  {result.type === 'place' && <MapPin className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
            {isSearching && (
              <div className="px-4 py-3 text-center text-xs text-gray-500">
                Searching more places...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter UI */}
      <div className="absolute top-20 left-4 z-10 flex space-x-2">
        {(['All', 'Events', 'Housing'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${filter === f ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Locate Me Button */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button 
          onClick={handleLocateMe}
          className="bg-white p-3 rounded-2xl shadow-lg text-zinc-900 hover:bg-gray-50 active:scale-95 transition-transform"
        >
          <Locate className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setView('people-nearby')}
          className="bg-zinc-900 p-3 rounded-2xl shadow-lg text-white hover:bg-zinc-800 active:scale-95 transition-transform"
          title="People Nearby"
        >
          <Users className="w-5 h-5" />
        </button>
      </div>

      {/* Add Buttons */}
      <div className="absolute bottom-20 left-4 z-10 flex flex-col space-y-2">
        <button onClick={() => setView('create-event')} className="bg-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold">Host Event</button>
        <button onClick={() => setView('create-housing')} className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold">Add Housing</button>
      </div>

      {/* Housing Details Drawer */}
      {view === 'housing-details' && selectedHousing && (
        <div className="absolute inset-x-0 bottom-0 top-20 z-50 bg-white rounded-t-3xl p-6 shadow-2xl">
          <button onClick={() => setView('map')} className="mb-4"><X /></button>
          <h2 className="text-2xl font-black mb-2">{selectedHousing.title}</h2>
          <p className="text-lg font-bold text-pink-600 mb-4">${selectedHousing.pricePerNight} / night</p>
          <div className="flex space-x-4">
            <a href={`https://wa.me/${selectedHousing.whatsappNumber}`} className="flex-1 bg-green-500 text-white py-3 rounded-xl flex items-center justify-center space-x-2">
              <MessageCircle /> <span>WhatsApp</span>
            </a>
            <a href={`tel:${selectedHousing.phoneNumber}`} className="flex-1 bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center space-x-2">
              <Phone /> <span>Call</span>
            </a>
          </div>
        </div>
      )}

      {/* Create Event Form */}
      {view === 'create-event' && (
        <div className="absolute inset-0 z-50 bg-white p-6 overflow-y-auto">
          <button onClick={() => setView('map')} className="mb-4"><X /></button>
          <h2 className="text-2xl font-black mb-4">Host New Event</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <input type="text" placeholder="Event Title" className="w-full p-3 border rounded-xl" required />
            <input type="date" className="w-full p-3 border rounded-xl" required />
            <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold">Create Event</button>
          </form>
        </div>
      )}

      {/* Create Housing Form */}
      {view === 'create-housing' && (
        <div className="absolute inset-0 z-50 bg-white p-6 overflow-y-auto">
          <button onClick={() => setView('map')} className="mb-4"><X /></button>
          <h2 className="text-2xl font-black mb-4">Add Housing</h2>
          <form onSubmit={handleCreateHousing} className="space-y-4">
            <input type="text" placeholder="Housing Title" className="w-full p-3 border rounded-xl" required />
            <input type="number" placeholder="Price per night" className="w-full p-3 border rounded-xl" required />
            <input type="text" placeholder="WhatsApp Number" className="w-full p-3 border rounded-xl" required />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Add Housing</button>
          </form>
        </div>
      )}

      {/* People Nearby View (WeChat Style) */}
      {view === 'people-nearby' && (
        <div className="absolute inset-0 z-[60] bg-[#f2f2f2] flex flex-col animate-in slide-in-from-right duration-300">
          <header className="bg-zinc-900 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <button onClick={() => setView('map')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-black tracking-tight">People Nearby</h2>
            </div>
            <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <MoreVertical className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="bg-white mb-4">
              {[...mockPeople].sort((a, b) => a.distance - b.distance).map((person) => (
                <div key={person.id} className="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-50 transition-colors group">
                  <div className="relative flex-shrink-0">
                    <img src={person.avatar} alt={person.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 ml-4 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-black text-zinc-900 truncate">{person.name}</h3>
                      <span className="text-[11px] font-bold text-zinc-400">{person.distance}km</span>
                    </div>
                    <p className="text-[13px] text-zinc-500 truncate mt-0.5">{person.bio}</p>
                    <div className="flex items-center mt-1.5 space-x-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded uppercase tracking-wider">
                        {person.lastSeen}
                      </span>
                      {person.isFriend && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded uppercase tracking-wider">
                          Friend
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="ml-2 p-2 text-zinc-400 hover:text-blue-500 transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-6 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
                <Eye className="w-8 h-8 text-zinc-300" />
              </div>
              <p className="text-sm font-bold text-zinc-400">Only people who have also used "People Nearby" will be visible here.</p>
              <button className="mt-6 text-blue-600 font-black text-sm hover:underline">Clear Location & Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyTab;
