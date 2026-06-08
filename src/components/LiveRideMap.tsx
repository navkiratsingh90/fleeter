"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { dropIcon, driverIcon, pickupIcon } from "./MapIcons";
import axios from "axios";



interface Props {
  driverLocation: [number, number] | null;
  pickUpLocation: [number, number] | null;
  dropLocation: [number, number] | null;
  mapStatus: string;
  onStats : (data : {
    distanceToPickUp : number, etaToPickUp : number, distanceToDrop: number, etaToDrop:number
  }) => void
}

function FitBounds({
  points,
}: {
  points: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (points.length < 2) return;

    map.fitBounds(points, {
      padding: [60, 60],
      maxZoom: 15,
      animate: true,
    });
  }, [map, points]);

  return null;
}

async function fetchRoute(
  from: [number, number],
  to: [number, number]
): Promise<[number, number][]> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  const coords = data?.routes?.[0]?.geometry?.coordinates;
  if (!Array.isArray(coords)) return [];

  return coords.map(
    ([lon, lat]: [number, number]) => [lat, lon]
  );
}

const LiveRideMap = ({
  driverLocation,
  pickUpLocation,
  dropLocation,
  mapStatus,
  onStats
}: Props) => {
  const [routeToPickUp, setRouteToPickUp] = useState<[number, number][]>([]);
  const [routeToDrop, setRouteToDrop] = useState<[number, number][]>([]);



  const center =
    origin ??
    pickUpLocation ??
    dropLocation ??
    driverLocation ??
    [20.5937, 78.9629];

  const mapKey = `${status}-${pickUpLocation?.[0] ?? ""}-${pickUpLocation?.[1] ?? ""}-${dropLocation?.[0] ?? ""}-${dropLocation?.[1] ?? ""}-${driverLocation?.[0] ?? ""}-${driverLocation?.[1] ?? ""}`;

  const showPickMarker = mapStatus === "arriving"
  const showPickUpRoute = mapStatus === "arriving" && routeToPickUp.length > 0
  const showDropRoute = mapStatus != "completed" && routeToDrop.length > 0


  useEffect(() => {
    if (!driverLocation) return;
  
    const [pLat, pLon] = pickUpLocation as [number, number];
    const [dLat, dLon] = dropLocation as [number, number];
    const [drLat, drLon] = driverLocation as [number, number];
  
    const getRoute = async (startLat: number, startLon: number, endLat: number, endLon: number) => {
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`
      );
      return res.data.routes![0];
    };
  
    const fetchRoutes = async () => {
      try {
        if (mapStatus === "arriving") {
          const pickUpRoute = await getRoute(drLat, drLon, pLat, pLon);
          const dropRoute = await getRoute(dLat, dLon, drLat, drLon);

      setRouteToPickUp(pickUpRoute.geometry.coordinates.map(
        ([lon, lat]: [number, number]) => [lat, lon]
      ));
      setRouteToDrop(dropRoute.geometry.coordinates.map(
        ([lon, lat]: [number, number]) => [lat, lon]
      ))
      onStats?.({
        distanceToPickUp: (pickUpRoute?.distance ?? 0) / 1000,
        etaToPickUp: (pickUpRoute?.duration ?? 0) / 60,
        distanceToDrop: (dropRoute?.distance ?? 0) / 1000,
        etaToDrop: (dropRoute?.duration ?? 0) / 60
    })

        }
        else{
          const dropRoute = await getRoute(dLat, dLon, drLat, drLon);
          setRouteToDrop(dropRoute.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          ))
          onStats?.({
            distanceToPickUp: 0,
            etaToPickUp: 0,
            distanceToDrop: (dropRoute?.distance ?? 0) / 1000,
            etaToDrop: (dropRoute?.duration ?? 0) / 60
        })
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchRoutes();
  }, [driverLocation, mapStatus]);
  if (!pickUpLocation) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "500px" }} className="relative">
      <MapContainer
        key={mapKey}
        center={pickUpLocation as any}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="&copy; CARTO contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* {route.length > 0 && (
          <FitBounds points={route} />
        )} */}

{routeToPickUp && routeToPickUp.length > 0 && (
          <Polyline
            positions={routeToPickUp}
            pathOptions={{
              color: "#0a0a0a",
              weight: 4,
              lineCap: "round",
              lineJoin: "round",
              dashArray: "2 10"
            }}
          />
        )}
        {routeToDrop && routeToDrop.length > 0 && (
          <Polyline
            positions={routeToDrop}
            pathOptions={{
              color: "#0a0a0a",
              weight: 4,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}
        { driverLocation && (
          <Marker
            position={driverLocation}
            icon={driverIcon}
          />
        )}

        {pickUpLocation && (
          <Marker
            position={pickUpLocation}
            icon={pickupIcon}
          />
        )}

        { dropLocation && (
          <Marker
            position={dropLocation}
            icon={dropIcon}
          />
        )}

        { dropLocation && (
          <Marker
            position={dropLocation}
            icon={dropIcon}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveRideMap;