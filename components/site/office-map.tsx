'use client';

import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';
import { useEffect, useRef } from 'react';
import { ATTRIBUTION, TILES } from '@/lib/map';

const PIN = '<span style="background:#0f3d33"><svg viewBox="0 0 24 24"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span>';

/** Single-pin map for the contact section. Scroll-wheel zoom is off so it never traps page scrolling. */
export default function OfficeMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | undefined;

    (async () => {
      const mod = await import('leaflet');
      const L = mod.default ?? mod;
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false }).setView([lat, lng], 15);
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({ className: 'am-pin', html: PIN, iconSize: [40, 40], iconAnchor: [20, 20] });
      L.marker([lat, lng], { icon, title: label }).addTo(map);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, label]);

  return <div ref={el} role="region" aria-label={label} className="h-full min-h-[320px] w-full rounded-2xl bg-mist" />;
}
