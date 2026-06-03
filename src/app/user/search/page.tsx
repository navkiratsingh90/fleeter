"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const SearchMap = dynamic(() => import("@/components/SearchMap"), {
  ssr: false,
});

const safeNum = (v: string | null) =>
  v && !isNaN(Number(v)) ? Number(v) : undefined;

const Page = () => {
  const params = useSearchParams();

  const pickup = params.get("pickup") ?? "";
  const drop = params.get("drop") ?? "";

  const pickUpLatitude = safeNum(params.get("pickuplat"));
  const pickUpLongitude = safeNum(params.get("pickuplon"));
  const dropLatitude = safeNum(params.get("droplat"));
  const dropLongitude = safeNum(params.get("droplon"));

  const hasCoords = useMemo(() => {
    return (
      pickUpLatitude !== undefined &&
      pickUpLongitude !== undefined
    );
  }, [pickUpLatitude, pickUpLongitude]);

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="h-[70vh] w-full">

        {hasCoords ? (
          <SearchMap
            pickUp={pickup}
            drop={drop}
            pickUpLat={pickUpLatitude!}
            pickUpLng={pickUpLongitude!}
            dropLat={dropLatitude}
            dropLng={dropLongitude}
            onChange={() => {}}
            onDistance={() => {}}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-red-500">
            Missing coordinates
          </div>
        )}

      </div>
    </div>
  );
};

export default Page;