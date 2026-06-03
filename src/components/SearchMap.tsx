"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// fix icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

const SearchMap = ({
  pickUpLat,
  pickUpLng,
  dropLat,
  dropLng,
}: any) => {
  if (pickUpLat == null || pickUpLng == null) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Invalid location
      </div>
    );
  }

  const center: [number, number] = [pickUpLat, pickUpLng];

  const route =
    dropLat != null && dropLng != null
      ? [
          [pickUpLat, pickUpLng],
          [dropLat, dropLng],
        ]
      : [];

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <Recenter center={center} />

        <Marker position={center} />

        {route.length === 2 && (
          <>
            <Marker position={route[1] as [number, number]} />
            <Polyline positions={route as any} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default SearchMap;