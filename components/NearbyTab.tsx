
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Search, Navigation, Users, Store, Calendar, Filter, List, Locate, Plus, X, Camera, Clock, Shield, Sparkles, Image as ImageIcon, ChevronLeft, Zap, Target, Phone, MessageCircle } from 'lucide-react';
import { mockEvents, mockHousing, Event, Housing } from '../src/constants';

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
          html: `<div class="w-8 h-8 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">E</div>`,
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
          html: `<div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">H</div>`,
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

      {/* Filter UI */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
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
      <button 
        onClick={handleLocateMe}
        className="absolute top-4 right-4 z-10 bg-white p-2.5 rounded-full shadow-md text-zinc-900 hover:bg-gray-50 active:scale-95 transition-transform mt-[480px]"
      >
        <Locate className="w-5 h-5" />
      </button>

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
    </div>
  );
};

export default NearbyTab;
