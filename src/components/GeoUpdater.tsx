"use client";

import { getSocket } from "@/lib/socket";
import React, { useEffect, useRef } from "react";

const GeoUpdater = ({ userId }: { userId: string }) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
	if (!userId) return;
	if (!navigator.geolocation) return;
  
	const socket = getSocket();
  
	const connectAndIdentify = () => {
	  socket.emit("identity", userId);
	};
  
	// initial connect
	connectAndIdentify();
  
	// if socket reconnects
	socket.on("connect", connectAndIdentify);
  
	const watcher = navigator.geolocation.watchPosition(
	  (position) => {
		socket.emit("update-location", {
		  userId,
		  latitude: position.coords.latitude,
		  longitude: position.coords.longitude,
		});
	  },
	  (err) => console.log("Geo error:", err),
	  {
		enableHighAccuracy: true,
		maximumAge: 5000,
	  }
	);
  
	return () => {
	  navigator.geolocation.clearWatch(watcher);
	  socket.off("connect", connectAndIdentify);
	};
  }, [userId]);

  return null;
};

export default GeoUpdater;