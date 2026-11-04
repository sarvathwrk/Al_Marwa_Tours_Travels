'use client';

import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';
import { createElement as lucideElement, MapPin } from 'lucide';
import { useEffect, useRef } from 'react';
import { ATTRIBUTION, TILES } from '@/lib/map';

function pinElement(): HTMLElement {
  const wrap = document.createElement('span');
  wrap.style.background = '#0f3d33';
  const svg = lucideElement(MapPin);
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  wrap.appendChild(svg);
  return wrap;
}

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
      const icon = L.divIcon({ className: 'am-pin', html: pinElement(), iconSize: [40, 40], iconAnchor: [20, 20] });
      L.marker([lat, lng], { icon, title: label }).addTo(map);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, label]);

  return <div ref={el} role="region" aria-label={label} className="h-full min-h-[320px] w-full rounded-2xl bg-mist" />;
}
