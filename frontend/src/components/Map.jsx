"use client";
import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, FeatureGroup, LayersControl } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Button } from "@/components/ui/button"
import {updateLandOwnership} from '@/lib/db';
import { FarmContext } from '@/context/farmcontext';


const MapComponent = () => {
  const {userid, surveyNo} = useContext(FarmContext);
  const [map, setMap] = useState(null);
  const [drawnItems, setDrawnItems] = useState(null);
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        setCenter([ 19.3199068, 74.1742963]);
      });
    }
  }, []);

  const handleCreated = (e) => {
    const { layer } = e;
    setDrawnItems(layer);
  };

  const handleSubmit = () => {
    if (drawnItems) {
      const type = drawnItems.toGeoJSON().geometry.type;
      if (type === 'Polygon') {
        const coordinates = drawnItems.toGeoJSON().geometry.coordinates[0];
        const area = L.GeometryUtil.geodesicArea(drawnItems.getLatLngs()[0]);
        console.log('Coordinates:', coordinates);
        console.log('Area:', area.toFixed(2)*0.0001, 'Ha');

        try{
          updateLandOwnership(8, `POINT(${center[1]} ${center[0]})`, `POLYGON((${coordinates.map(c => c.join(' ')).join(',')}))`, area.toFixed(2)*0.0001, coordinates, surveyNo? surveyNo: '123').then(() => {
            window.alert('Land Ownership updated successfully');
            window.location.href = '/intermed';
          }
          ).catch(err => {
            window.alert('Error updating land ownership');
          });
        }
        catch(err){
          window.alert('Error updating land ownership');
        }

      } else {
        window.alert('Please draw a polygon');
      }
    } else {
      window.alert('Please draw a polygon');
    }
  };

  return (
    <div>
      {center[0] !== 0 &&<div><MapContainer
        center={center}
        zoom={19}
        style={{ height: '400px', width: '100%' }}
        whenCreated={setMap}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              rectangle: false,
              polygon: true,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
      <Button className="flex justify-center items-center m-2" onClick={handleSubmit}>Submit</Button>
      </div>}
        
    </div>
  );
};

export default MapComponent;