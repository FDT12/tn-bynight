// frontend/src/components/LeafletMap.tsx - UPDATED
"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tunisiaRegionsGeoJSON } from '@/data/tunisiaRegions';

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

export default function LeafletMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [month, setMonth] = useState<string>("March 2024");
  const [simulated, setSimulated] = useState(false);

  // Style function for regions
  const regionStyle = (feature: any) => {
    const score = feature.properties.score || 0;
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
    
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${regionName}</h3>
        <p class="text-sm">Events this month: <strong>${feature.properties.events}</strong></p>
        <p class="text-sm">Activity score: <strong>${feature.properties.score}/10</strong></p>
        <button class="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          View Details
        </button>
      </div>
    `);
  };

  const simulateData = () => {
    const today = new Date().toLocaleString("en-US", {month: "long",year: "numeric"
  });
    setMonth(today);
    setSimulated(true);
  };

  const resetData = () => {
  const today = new Date().toLocaleString("en-US", {month: "long",year: "numeric"
  });

  setMonth(today);
  setSimulated(false);
};


  const selectedRegionData = selectedRegion 
    ? tunisiaRegionsGeoJSON.features.find(f => f.properties.name === selectedRegion)?.properties
    : null;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tunisia Nightlife Heat Map</CardTitle>
          <p className="text-gray-600">Showing nightlife activity levels for {month}</p>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={simulateData} variant={simulated ? "secondary" : "default"}>
              {simulated ? "Simulated Data" : "Simulate New Month"}
            </Button>
            <Button onClick={resetData} variant="outline">
              Reset to Original
            </Button>
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
          <div className="h-[500px] w-full rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg mb-6">
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
              <GeoJSON
                data={tunisiaRegionsGeoJSON as any}
                style={regionStyle}
                onEachFeature={onEachRegion}
              />
            </MapContainer>
          </div>

          {/* Map Instructions */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Click on any colored region to see details. Hover over regions to highlight them.
              The map is centered on Tunisia. Regions show activity levels based on number of events.
            </p>
          </div>

          {/* Selected Region Info */}
          {selectedRegion && selectedRegionData ? (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedRegion}</h3>
                    <p className="text-gray-600">Governorate Details</p>
                  </div>
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Activity Score</p>
                    <p className="text-3xl font-bold" style={{ color: getColor(selectedRegionData?.score ?? 0) }}>
                      {selectedRegionData.score}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Events This Month</p>
                    <p className="text-3xl font-bold text-gray-800">{selectedRegionData.events}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-lg font-medium">{month}</p>
                  </div>
                </div>
                
                {/* Sample Events */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Sample Nightlife Events:</h4>
                  <div className="space-y-3">
                    {Array.from({ length: Math.min(selectedRegionData.events, 3) }).map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{selectedRegion} Night Event #{i + 1}</p>
                            <p className="text-sm text-gray-600">
                              {simulated ? 'April 15, 2024' : 'March 20, 2024'} • Popular Venue
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Details</Button>
                            <Button size="sm">Get Tickets</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedRegionData.events > 3 && (
                      <p className="text-center text-gray-500">
                        + {selectedRegionData.events - 3} more events this month
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* How It Works */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-3">How This Heat Map Works</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Data Source:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Events scraped from teskerti.tn</li>
                    <li>• Each region gets a score based on event count</li>
                    <li>• Colors represent activity intensity</li>
                    <li>• Updates monthly with new events</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Next Steps:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✅ Frontend visualization complete</li>
                    <li>🔜 Build Flask API backend</li>
                    <li>🔜 Connect to real event data</li>
                    <li>🔜 Deploy to Vercel + Railway</li>
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