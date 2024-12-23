"use client"
import React, { useState, useEffect } from 'react';
import Map, { 
  Marker, 
  Popup, 
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Source,
  Layer
} from 'react-map-gl';
import { Phone, AlertTriangle, Info, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const heatmapLayer = {
  id: 'heatmap',
  type: 'heatmap',
  paint: {
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'riskScore'],
      0, 0,
      6, 1
    ],
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 1,
      9, 3
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(33,102,172,0)',
      0.2, 'rgb(103,169,207)',
      0.4, 'rgb(209,229,240)',
      0.6, 'rgb(253,219,199)',
      0.8, 'rgb(239,138,98)',
      1, 'rgb(178,24,43)'
    ],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 2,
      9, 20
    ],
    'heatmap-opacity': 0.7
  }
};

const EmergencyMap = () => {
  const [viewState, setViewState] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    zoom: 11
  });
  const [loading, setLoading] = useState(true);
  const [popupInfo, setPopupInfo] = useState(null);

  const geojsonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { riskScore: 5, description: 'High risk area' },
        geometry: {
          type: 'Point',
          coordinates: [77.2090, 28.6139]
        }
      },
      {
        type: 'Feature',
        properties: { riskScore: 2, description: 'Low risk area' },
        geometry: {
          type: 'Point',
          coordinates: [77.2150, 28.6200]
        }
      }
    ]
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="p-4 flex justify-between items-center bg-white">
        <h1 className="text-2xl font-bold">Emergency Response Map</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Emergency Contacts
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emergency Contact Numbers</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Police</span>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = 'tel:100'}
                >
                  100
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Ambulance</span>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = 'tel:102'}
                >
                  102
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Emergency Helpline</span>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = 'tel:112'}
                >
                  112
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 relative">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={(e) => {
            const features = e.features;
            if (features && features.length > 0) {
              setPopupInfo(features[0]);
            }
          }}
          style={{ width: '100%', height: '70%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken="pk.eyJ1IjoibWFoaWkwNyIsImEiOiJjbTRsbXcxemkwMzl2MmlzM2xuMW1yNjYyIn0.Fl-SlD2tQss_Md5u2BqunA"
        >
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />

          <Source type="geojson" data={geojsonData}>
            <Layer {...heatmapLayer} />
            {geojsonData.features.map((feature, index) => (
              <Marker
                key={index}
                longitude={feature.geometry.coordinates[0]}
                latitude={feature.geometry.coordinates[1]}
                onClick={() => setPopupInfo(feature.properties)}
              />
            ))}
          </Source>

          {popupInfo && (
            <Popup
              longitude={popupInfo.coordinates[0]}
              latitude={popupInfo.coordinates[1]}
              onClose={() => setPopupInfo(null)}
            >
              <div>
                <strong>{popupInfo.description}</strong>
                <p>Risk Score: {popupInfo.riskScore}</p>
              </div>
            </Popup>
          )}
        </Map>

        <Card className="absolute bottom-4 right-4 w-64">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Risk Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span>Low Risk</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyMap;
