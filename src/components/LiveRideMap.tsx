"use client";

import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { dropIcon, pickupIcon } from "./MapIcons";

interface Props {
  driverLocation: [number, number] | null;
  pickUpLocation: [number, number] | null;
  dropLocation: [number, number] | null;
}

const LiveRideMap = ({
  driverLocation,
  pickUpLocation,
  dropLocation,
}: Props) => {
  if (!pickUpLocation) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <MapContainer
        key={`${pickUpLocation[0]}-${pickUpLocation[1]}`}
        center={pickUpLocation}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="&copy; CARTO contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <Marker
          position={pickUpLocation}
          icon={pickupIcon}
        />

        {dropLocation && (
          <Marker
            position={dropLocation}
            icon={dropIcon}
          />
        )}

        {driverLocation && (
          <Marker
            position={driverLocation}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveRideMap;