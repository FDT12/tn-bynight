// frontend/src/components/HeatMap.tsx - UPDATED
"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tunisiaRegionsGeoJSON } from '@/data/tunisiaRegions';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';
import { SuggestEventModal } from './SuggestEventModal';

// CORRECT Tunisia coordinates (centered on Tunisia)
const TUNISIA_CENTER: [number, number] = [34.0, 9.5]; // Latitude, Longitude
const ZOOM_LEVEL = 7; // Zoom in closer

// Color based on score
const getColor = (score: number) => {
  if (score >= 7) return '#ef4444'; // Red
  if (score >= 4) return '#f97316'; // Orange
  if (score >= 1) return '#fbbf24'; // Yellow
  return '#3b82f6'; // Blue
};

interface Event {
    id: number;
    name: string;
    place: string;
    date: string;
    price: string;
    url: string;
    city: string;
}

interface HeatmapData {
    governorate: string;
    score: number;
    color: string;
    events_count: number;
    events: Event[];
}

interface ApiResponse {
    success: boolean;
    data: HeatmapData[];
}

export default function HeatMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<Record<string, HeatmapData>>({});
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState<string>("");

  // Auth State
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/heatmap/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result: ApiResponse = await response.json();
                
                // Transform array to map for easier lookup
                const dataMap: Record<string, HeatmapData> = {};
                result.data.forEach(item => {
                    dataMap[item.governorate] = item;
                });
                
                setHeatmapData(dataMap);
                setMonth(new Date().toLocaleString("en-US", {month: "long", year: "numeric"}));
            } catch (error) {
                console.error("Error fetching heatmap data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeatmapData();
    }, []);

  // Style function for regions
  const regionStyle = (feature: any) => {
    const regionName = feature.properties.name;
    const regionData = heatmapData[regionName];
    const score = regionData ? regionData.score : 0;
    
    return {
      fillColor: getColor(score),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  // Handle region click
  const onEachRegion = (feature: any, layer: any) => {
    const regionName = feature.properties.name;
    const regionData = heatmapData[regionName];
    
    layer.bindTooltip(`
        <div class="p-2">
            <h3 class="font-bold">${regionName}</h3>
            <p>Score: ${regionData ? regionData.score : 0}</p>
            <p>Events: ${regionData ? regionData.events_count : 0}</p>
        </div>
    `, {
        permanent: false,
        direction: "top"
    });

    layer.on({
      click: () => {
        setSelectedRegion(regionName);
      },
      mouseover: (e: any) => {
        e.target.setStyle({
          weight: 4,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
      },
      mouseout: (e: any) => {
        e.target.setStyle(regionStyle(feature));
      }
    });
  };

  const selectedRegionData = selectedRegion && heatmapData[selectedRegion] 
    ? heatmapData[selectedRegion]
    : null;

  return (
    <div className="container mx-auto p-4">
      {/* Auth & Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} 
      />
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)} 
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} 
      />
      <SuggestEventModal 
        isOpen={showSuggest} 
        onClose={() => setShowSuggest(false)} 
        initialCity={selectedRegion}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Tunisia Nightlife Heat Map</CardTitle>
              <p className="text-gray-600">Showing nightlife activity levels for {month}</p>
            </div>
            <div className="flex gap-2">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Hi, {user.username}</span>
                        <Button variant="outline" onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setShowLogin(true)}>Login</Button>
                        <Button onClick={() => setShowRegister(true)}>Sign Up</Button>
                    </div>
                )}
            </div>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm font-medium">Activity Level:</span>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-xs">Low (0)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-yellow-400"></div>
                  <span className="text-xs">Medium (1-3)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span className="text-xs">High (4-6)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-xs">Very High (7+)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="h-[500px] w-full rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg mb-6 relative">
            {loading && (
                <div className="absolute inset-0 z-[1000] bg-white/50 flex items-center justify-center">
                    <p className="text-lg font-bold">Loading Data...</p>
                </div>
            )}
            <MapContainer
              center={TUNISIA_CENTER}
              zoom={ZOOM_LEVEL}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              className="rounded-md"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {!loading && (
                  <GeoJSON
                    key={JSON.stringify(heatmapData)} // Force re-render when data changes
                    data={tunisiaRegionsGeoJSON as any}
                    style={regionStyle}
                    onEachFeature={onEachRegion}
                  />
              )}
            </MapContainer>
          </div>

          {/* Selected Region Info */}
          {selectedRegion ? (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedRegion}</h3>
                    <p className="text-gray-600">Governorate Details</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div 
                        className="w-8 h-8 rounded" 
                        style={{ backgroundColor: getColor(selectedRegionData?.score ?? 0) }}
                        ></div>
                        <span className="font-semibold">
                        {(selectedRegionData?.score ?? 0) >= 7 ? 'Very High Activity' :
                        (selectedRegionData?.score ?? 0) >= 4 ? 'High Activity' :
                        (selectedRegionData?.score ?? 0) >= 1 ? 'Medium Activity' : 'Low Activity'}
                        </span>
                    </div>
                    {user && (
                        <Button size="sm" variant="secondary" onClick={() => setShowSuggest(true)}>
                            + Suggest Event
                        </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Activity Score</p>
                    <p className="text-3xl font-bold" style={{ color: getColor(selectedRegionData?.score ?? 0) }}>
                      {selectedRegionData?.score ?? 0}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Events This Month</p>
                    <p className="text-3xl font-bold text-gray-800">{selectedRegionData?.events_count ?? 0}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-lg font-medium">{month}</p>
                  </div>
                </div>
                
                {/* Events List */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Upcoming Events:</h4>
                  {selectedRegionData?.events && selectedRegionData.events.length > 0 ? (
                      <div className="space-y-3">
                        {selectedRegionData.events.map((event) => (
                          <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex-1">
                                <p className="font-bold text-lg">{event.name}</p>
                                <div className="text-sm text-gray-600 space-y-1 mt-1">
                                    <p>📍 {event.place} • {event.city}</p>
                                    <p>📅 {event.date} • 💰 {event.price}</p>
                                </div>
                              </div>
                              <div className="shrink-0">
                                {event.url && (
                                    <a href={event.url} target="_blank" rel="noreferrer">
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                            Get Tickets
                                        </Button>
                                    </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                  ) : (
                      <p className="text-gray-500 italic">No approved events found for this region.</p>
                  )}
                  
                  {!user && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 flex justify-between items-center">
                          <span>Know about an event happening in {selectedRegion}?</span>
                          <Button variant="link" onClick={() => setShowLogin(true)}>Login to Suggest</Button>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">
                Click on a region to see details
            </div>
          )}

          {/* How It Works */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-3">How This Heat Map Works</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Data Source:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Events scraped directly from nightlife platforms</li>
                    <li>• Real-time data processing via Flask API</li>
                    <li>• Dynamic score calculation based on event volume</li>
                  </ul>
                </div>
                <div>
                    <h5 className="font-medium mb-2">Community:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Users can register and suggest new events</li>
                        <li>• Okta 2FA Security Integration</li>
                        <li>• Community suggestions reviewed by admins</li>
                    </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
