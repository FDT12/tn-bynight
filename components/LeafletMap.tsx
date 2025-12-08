// frontend/src/components/LeafletMap.tsx
"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Tunisia coordinates
const TUNISIA_CENTER: [number, number] = [34.0, 9.0];
const ZOOM_LEVEL = 6;

// Mock GeoJSON data for Tunisia regions (simplified)
const tunisiaGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Tunis", score: 8 },
      geometry: {
        type: "Polygon",
        coordinates: [[[10.1, 36.8], [10.3, 36.8], [10.3, 36.9], [10.1, 36.9], [10.1, 36.8]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Sousse", score: 7 },
      geometry: {
        type: "Polygon",
        coordinates: [[[10.6, 35.8], [10.8, 35.8], [10.8, 36.0], [10.6, 36.0], [10.6, 35.8]]]
      }
    },
    // Add more regions as needed
  ]
};

// Color based on score
const getColor = (score: number) => {
  if (score >= 7) return '#ef4444'; // Red
  if (score >= 4) return '#f97316'; // Orange
  if (score >= 1) return '#fbbf24'; // Yellow
  return '#3b82f6'; // Blue
};

export default function LeafletMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Style function for regions
  const regionStyle = (feature: any) => {
    const score = feature.properties.score || 0;
    return {
      fillColor: getColor(score),
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  // Handle region click
  const onEachRegion = (feature: any, layer: any) => {
    const regionName = feature.properties.name;
    layer.on({
      click: () => {
        setSelectedRegion(regionName);
      }
    });
    
    layer.bindPopup(`<b>${regionName}</b><br>Score: ${feature.properties.score}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tunisia Nightlife Heat Map</CardTitle>
          <p className="text-gray-600">Interactive map showing activity levels across Tunisia</p>
        </CardHeader>
        <CardContent>
          {/* Map Container */}
          <div className="h-[500px] w-full rounded-lg overflow-hidden border-2 border-gray-300">
            <MapContainer
              center={TUNISIA_CENTER}
              zoom={ZOOM_LEVEL}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON
                data={tunisiaGeoJSON as any}
                style={regionStyle}
                onEachFeature={onEachRegion}
              />
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-500"></div>
              <span className="text-sm">0 events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-yellow-400"></div>
              <span className="text-sm">1-3 events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-orange-500"></div>
              <span className="text-sm">4-6 events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-500"></div>
              <span className="text-sm">7+ events</span>
            </div>
          </div>

          {/* Selected Region Info */}
          {selectedRegion && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{selectedRegion}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Activity Score</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Heat Level</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-red-500"></div>
                      <span>Very High</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="mt-6 flex gap-4">
            <Button onClick={() => alert('This would fetch real API data')}>
              Load Real Data
            </Button>
            <Button variant="outline" onClick={() => setSelectedRegion(null)}>
              Clear Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}