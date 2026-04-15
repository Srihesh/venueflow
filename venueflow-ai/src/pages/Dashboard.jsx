import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, HeatmapLayer } from '@react-google-maps/api';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import { ShieldAlert, Cpu, Radio, Radar, ActivitySquare } from 'lucide-react';
import { START_SIMULATION } from '../simulator';
import { getProphecy } from '../gemini';

const LIBRARIES = ["visualization"];
const CENTER = { lat: 51.5560, lng: -0.2795 };

const getHeatmapData = (zones) => {
  if (!window.google) return [];
  const points = [];
  const addPoints = (centerLat, centerLng, count, radius) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      points.push(
        new window.google.maps.LatLng(
          centerLat + r * Math.sin(angle),
          centerLng + r * Math.cos(angle)
        )
      );
    }
  };

  const zoneCoords = {
    "North Stand": { lat: 51.5565, lng: -0.2795 },
    "South Stand": { lat: 51.5555, lng: -0.2795 },
    "East Stand": { lat: 51.5560, lng: -0.2785 },
    "West Stand": { lat: 51.5560, lng: -0.2805 },
    "Central Pitch": { lat: 51.5560, lng: -0.2795 },
  };

  Object.keys(zones || {}).forEach(zoneKey => {
    const coord = zoneCoords[zoneKey];
    if (coord) {
      const density = Math.floor(zones[zoneKey] * 50); 
      addPoints(coord.lat, coord.lng, density, 0.0004);
    }
  });
  return points;
};

// Hyper Cinematic Tech Map Style
const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0B0E14" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#2E3B52" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B0E14" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2E3B52" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#172033" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#04060A" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#161D2E" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#24304A" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1C253B" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#3B82F6", weight: 0.5 }] },
];

export default function Dashboard() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCM2ghYaey0goO2Zsby_Su6vRN7KFYea1s",
    libraries: LIBRARIES
  });

  const [data, setData] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [prophecy, setProphecy] = useState("");

  useEffect(() => {
    const dataRef = ref(db, 'venueData');
    const unsub = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        if (isLoaded) {
          setHeatmapData(getHeatmapData(val.zones));
        }
      }
    });
    return () => unsub();
  }, [isLoaded]);

  useEffect(() => {
    if (data) {
      const interval = setInterval(async () => {
         const newProphecy = await getProphecy(data.zones);
         setProphecy(newProphecy);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [data]);

  useEffect(() => {
    if (!window.__simStarted) {
      window.__simStarted = true;
      START_SIMULATION();
    }
  }, []);

  const injectHalftimeRush = async () => {
    if (!data) return;
    const rushData = {
       ...data,
       gates: { A: 45, B: 55, C: 40, D: 60 },
       zones: { "North Stand": 0.95, "South Stand": 0.98, "East Stand": 0.88, "West Stand": 0.90, "Central Pitch": 0.10 },
       concessions: [{ id: 1, name: "Burger Stand", waitTime: 45 }, { id: 2, name: "Beer & Pretzels", waitTime: 38 }, { id: 3, name: "Ice Cream Cart", waitTime: 25 }]
    };
    await set(ref(db, 'venueData'), rushData);
    setProphecy("SCENARIO ACTIVE: Global congestion detected. Recommend dispatching overflow response units.");
  };

  const injectEvacuationClear = async () => {
    if (!data) return;
    const clearData = {
       ...data,
       gates: { A: 0, B: 0, C: 0, D: 0 },
       zones: { "North Stand": 0.05, "South Stand": 0.02, "East Stand": 0.01, "West Stand": 0.04, "Central Pitch": 0.01 },
       concessions: [{ id: 1, name: "Burger Stand", waitTime: 0 }, { id: 2, name: "Beer & Pretzels", waitTime: 0 }, { id: 3, name: "Ice Cream Cart", waitTime: 0 }]
    };
    await set(ref(db, 'venueData'), clearData);
    setProphecy("SCENARIO ACTIVE: Venue capacity is nominal. Zero density parameters recorded.");
  };

  if (!isLoaded) return (
    <div className="flex items-center justify-center h-screen bg-cine-dark text-cine-accent text-sm uppercase tracking-[0.3em] animate-pulse">
       Establishing Uplink...
    </div>
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-cine-dark text-slate-200">
      
      {/* 1. Full Screen Cinematic Background Map */}
      <div className="absolute inset-0 z-0">
        <GoogleMap
          zoom={17}
          center={CENTER}
          mapContainerClassName="w-full h-full"
          options={{
            disableDefaultUI: true,
            gestureHandling: 'cooperative', // Put back to default or cooperative so they can look around
            styles: MAP_STYLES
          }}
        >
          {heatmapData.length > 0 && (
            <HeatmapLayer 
              data={heatmapData} 
              options={{ 
                radius: 40, 
                opacity: 0.8,
                gradient: [
                  'rgba(0, 0, 0, 0)',
                  'rgba(59, 130, 246, 0.4)',  // Blue
                  'rgba(99, 102, 241, 0.6)',  // Indigo
                  'rgba(168, 85, 247, 0.8)',  // Purple
                  'rgba(236, 72, 153, 0.9)',  // Pink
                  'rgba(239, 68, 68, 1)',     // Red
                ]
              }} 
            />
          )}
        </GoogleMap>
        {/* Subtle vignette overlay on top of map to darken edges */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_50%,rgba(7,9,13,0.8)_100%)]"></div>
      </div>

      {/* 2. Floating Spatial UI Container */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 md:p-10 flex flex-col justify-between">
        
        {/* Top Header Row Panel */}
        <div className="flex justify-between items-start pointer-events-auto">
          {/* Main Title Badge */}
          <div className="glass-panel px-6 py-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
               <Radar size={20} className="text-cine-accent animate-spin" style={{ animationDuration: '4s' }} />
             </div>
             <div>
               <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">Global View</h2>
               <h1 className="text-xl font-bold tracking-tight text-white cine-text-glow">GEOSPATIAL COMMAND</h1>
             </div>
          </div>

          {/* Director Overrides (Top Right) */}
          <div className="glass-panel p-5 w-[340px] border-t-2 border-t-blue-500">
            <div className="flex items-center gap-3 mb-4">
               <Cpu className="text-blue-400" size={18} />
               <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300">System Overrides</h3>
            </div>
            <div className="flex gap-2">
               <button onClick={injectHalftimeRush} className="flex-1 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-100 text-[10px] font-bold py-2 rounded uppercase tracking-wider transition-all">
                  Inject Surge
               </button>
               <button onClick={injectEvacuationClear} className="flex-1 bg-slate-700/50 hover:bg-slate-600 border border-slate-500/50 text-slate-200 text-[10px] font-bold py-2 rounded uppercase tracking-wider transition-all">
                  Clear Sector
               </button>
            </div>
          </div>
        </div>

        {/* Bottom Row Panels */}
        <div className="flex flex-col md:flex-row gap-6 justify-end items-end pointer-events-auto">
          
          {/* AI Insights Card */}
          <div className="glass-panel p-6 w-[400px]">
            <div className="flex items-center gap-3 mb-4">
               <ActivitySquare className="text-purple-400" size={18} />
               <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300">Live Telemetry Analysis</h3>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-purple-500/50 to-transparent mb-4"></div>
            <p className="text-sm font-medium text-slate-200 leading-relaxed drop-shadow-md min-h-[60px]">
              {prophecy ? prophecy : "Processing neural spatial net..."}
            </p>
          </div>

          {/* Density Panel */}
          <div className="glass-panel p-6 w-[340px] border-l-2 border-l-indigo-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <Radio className="text-indigo-400" size={18} />
                 <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300">Sector Saturation</h3>
              </div>
            </div>
            <div className="space-y-4">
              {!data && <span className="text-sm text-slate-500 italic">Syncing nodes...</span>}
              {data?.zones && Object.entries(data.zones).map(([zone, density]) => {
                const isWarning = density > 0.7;
                return (
                  <div key={zone} className="flex flex-col gap-2 relative">
                     <div className="flex justify-between items-center text-xs font-bold tracking-wider">
                        <span className={`flex items-center gap-2 ${isWarning ? 'text-red-400' : 'text-slate-300'}`}>
                           {isWarning && <ShieldAlert size={12} className="animate-ping" />} 
                           {zone}
                        </span>
                        <span className="text-white">{Math.round(density * 100)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                       <div 
                          className={`h-full transition-all duration-1000 bg-gradient-to-r ${isWarning ? 'from-red-600 to-red-400 shadow-[0_0_10px_rgba(2ef,68,68,0.8)]' : 'from-blue-600 to-indigo-400'}`} 
                          style={{ width: `${Math.round(density * 100)}%` }}
                       ></div>
                     </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
