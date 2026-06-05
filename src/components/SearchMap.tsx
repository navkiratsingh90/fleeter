"use client";

import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { dropIcon, pickupIcon } from "./MapIcons";
import LoadingSpinner from "./LoadingSpinner";
import { Navigation2 } from "lucide-react";

interface Props {
  pickup: string;
  drop: string;
  onChange: (
    pickup: string,
    drop: string,
    pickupLat?: number,
    pickupLon?: number,
    dropLat?: number,
    dropLon?: number
  ) => void;
  onDistance: (d: number) => void;
}

function FitBounds({
  p1,
  p2,
}: {
  p1: [number, number];
  p2: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    map.fitBounds([p1, p2], {
      padding: [72, 72],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [map, p1, p2]);

  return null;
}

export default function SearchMap({
  pickup,
  drop,
  onChange,
  onDistance,
}: Props) {
  const [p1, setP1] = useState<[number, number] | null>(null);
  const [p2, setP2] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [km, setKm] = useState<number>(0);

  const geoCoding = async (
    q: string
  ): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          q.trim()
        )}&limit=1`
      );

      if (!data?.features?.length) return null;

      // Photon returns [longitude, latitude]
      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lat, lon];
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const loadRoute = async (p: [number, number], d: [number, number]) => {
    try {
      const { data } = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`
      );

      if (!data?.routes?.length) return;

      const routeCoordinates: [number, number][] =
        data.routes[0].geometry.coordinates.map(
          ([lon, lat]: [number, number]) => [lat, lon]
        );

      setRoute(routeCoordinates);

      const distance = +(data.routes[0].distance / 1000).toFixed(2);
      setKm(distance);
      onDistance(distance);
    } catch (error) {
      console.error(error);
    }
  };

  const reverseGeocoding = async (
    latitude: number,
    longitude: number
  ): Promise<string | undefined> => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`
      );

      if (!data?.features?.length) return;

      const place = data.features[0].properties;

      const address = [
        place?.name,
        place?.street,
        place?.city,
        place?.state,
        place?.country,
      ]
        .filter(Boolean)
        .join(", ");

      return address;
    } catch (error) {
      console.error(error);
    }
  };

  const dragPickUp = async (lat: number, lon: number) => {
    const add = await reverseGeocoding(lat, lon);

    setP1([lat, lon]);

    if (p2) {
      await loadRoute([lat, lon], p2);
    }

    onChange(add ?? pickup, drop, lat, lon, p2?.[0], p2?.[1]);
  };

  const dragDrop = async (lat: number, lon: number) => {
    const add = await reverseGeocoding(lat, lon);

    setP2([lat, lon]);

    if (p1) {
      await loadRoute(p1, [lat, lon]);
    }

    onChange(pickup, add ?? drop, p1?.[0], p1?.[1], lat, lon);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!pickup || !drop) {
        if (mounted) setLoading(false);
        return;
      }

      const a = await geoCoding(pickup);
      const b = await geoCoding(drop);

      if (!mounted) return;

      if (!a || !b) {
        setLoading(false);
        return;
      }

      setP1(a);
      setP2(b);

      onChange(pickup, drop, a[0], a[1], b[0], b[1]);

      await loadRoute(a, b);

      if (mounted) setLoading(false);
    };

    init();

    return () => {
      mounted = false;
    };
  }, [pickup, drop]);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ width: "100%", height: "500px" }} className="relative">
      <MapContainer
        center={p1 ?? [0, 0]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="&copy; CARTO contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {p1 && p2 && <FitBounds p1={p1} p2={p2} />}

        {p1 && (
          <Marker
            position={p1}
            icon={pickupIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragPickUp(m.lat, m.lng);
              },
            }}
          />
        )}

        {p2 && (
          <Marker
            position={p2}
            icon={dropIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragDrop(m.lat, m.lng);
              },
            }}
          />
        )}

        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#0a0a0a",
              weight: 4,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 rounded-full border border-white bg-black px-4 py-2 shadow-lg">
        <Navigation2 size={14} className="text-white" />

        <span className="text-xs font-bold text-white">
          {km ? `${km.toFixed(1)} km` : "-- km"}
        </span>

        <span className="h-3 w-px bg-white" />

        <span className="text-xs text-white">
          {km ? `~${Math.max(3, Math.round((km / 25) * 60))} min` : "-- min"}
        </span>
      </div>
    </div>
  );
}