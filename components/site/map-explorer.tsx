'use client';

import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap, Marker } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MAP_UI } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { waLink } from '@/lib/images';
import { CATEGORIES, CITIES, PLACES, type CategoryId, type CityId, type Place } from '@/lib/places';
import { useLang } from './lang';

// Keyless OpenStreetMap tiles. Fine for a small site; for heavy traffic switch to a keyed provider
// (MapTiler, Stadia, Mapbox) and set the URL + attribution here.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      // Static, trusted constants from lib/places.ts.
      dangerouslySetInnerHTML={{ __html: CATEGORIES[id].icon }}
    />
  );
}

function popupHtml(place: Place, lang: Locale, whatsapp: string) {
  const name = bi(lang, place.name);
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  const wa = waLink(whatsapp, bi(lang, MAP_UI.waMessage(name)));
  const btn = 'inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold';
  return `<div>
    <strong class="font-display text-lg font-bold text-haram">${esc(name)}</strong>
    <p class="mb-3 mt-1.5 text-[13px] leading-snug text-muted">${esc(bi(lang, place.blurb))}</p>
    <div class="flex flex-wrap gap-2">
      <a class="${btn} bg-haram text-white" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">${esc(bi(lang, MAP_UI.ask))}</a>
      <a class="${btn} border border-line text-haram" href="${esc(gmaps)}" target="_blank" rel="noopener noreferrer">${esc(bi(lang, MAP_UI.directions))}</a>
    </div>
  </div>`;
}

export default function MapExplorer({ whatsapp }: { whatsapp: string }) {
  const { lang } = useLang();
  const [city, setCity] = useState<CityId>('makkah');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markers = useRef(new Map<string, Marker>());

  const visiblePlaces = useMemo(
    () => PLACES.filter((p) => p.city === city && (!category || p.category === category)),
    [city, category],
  );

  // 1. Create the map once, on the client only (Leaflet touches `window`).
  useEffect(() => {
    let cancelled = false;
    const markerStore = markers.current;

    (async () => {
      const mod = await import('leaflet');
      const L = mod.default ?? mod;
      if (cancelled || !containerRef.current) return;

      const start = CITIES.makkah;
      const map = L.map(containerRef.current, { zoomControl: false }).setView(start.center, start.zoom);
      L.control.zoom({ position: 'topright' }).addTo(map);
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

      for (const place of PLACES) {
        const cat = CATEGORIES[place.category];
        const icon = L.divIcon({
          className: 'am-pin',
          html: `<span style="background:${cat.color}"><svg viewBox="0 0 24 24">${cat.icon}</svg></span>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -22],
        });
        const marker = L.marker([place.lat, place.lng], { icon, title: place.name.en, keyboard: true });
        marker.on('click', () => setSelectedId(place.id));
        markerStore.set(place.id, marker);
      }

      mapRef.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerStore.clear();
      setReady(false);
    };
  }, []);

  // 2. Show only markers for the chosen city and category.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const visible = new Set(visiblePlaces.map((p) => p.id));
    for (const [id, marker] of markers.current) {
      if (visible.has(id)) marker.addTo(map);
      else marker.remove();
    }
    setSelectedId((current) => (current && !visible.has(current) ? null : current));
  }, [ready, visiblePlaces]);

  // 3. Move the camera when the city changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const target = CITIES[city];
    map.flyTo(target.center, target.zoom, { duration: 0.9 });
  }, [ready, city]);

  // 4. Popups follow the language.
  useEffect(() => {
    if (!ready) return;
    for (const place of PLACES) {
      const marker = markers.current.get(place.id);
      if (!marker) continue;
      if (marker.getPopup()) marker.setPopupContent(popupHtml(place, lang, whatsapp));
      else marker.bindPopup(popupHtml(place, lang, whatsapp), { maxWidth: 280, closeButton: true });
    }
  }, [ready, lang, whatsapp]);

  // 5. Selecting a place highlights its pin, centres it and opens the popup.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    for (const [id, marker] of markers.current) marker.getElement()?.classList.toggle('is-active', id === selectedId);
    if (!selectedId) return;
    const place = PLACES.find((p) => p.id === selectedId);
    const marker = markers.current.get(selectedId);
    if (!place || !marker) return;
    map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 15), { duration: 0.7 });
    marker.openPopup();
  }, [ready, selectedId]);

  const tile = 'flex flex-col items-center justify-center gap-2.5 rounded-2xl p-4 text-center text-[13px] font-semibold leading-snug transition-colors';

  return (
    <div className="grid h-[calc(100dvh-72px)] grid-rows-[42%_58%] lg:grid-cols-[430px_1fr] lg:grid-rows-1">
      <div className="relative order-1 lg:order-2">
        <div ref={containerRef} className="absolute inset-0 bg-mist" role="region" aria-label={bi(lang, MAP_UI.title)} />
        {!ready && <p className="absolute inset-0 grid place-items-center text-sm text-muted">…</p>}
      </div>

      <aside className="order-2 overflow-y-auto bg-white px-6 pb-10 pt-7 lg:order-1">
        <h1 className="font-display text-3xl font-bold leading-tight text-haram">{bi(lang, MAP_UI.title)}</h1>

        <div className="mt-5 inline-flex rounded-full bg-mist p-1" role="group" aria-label="City">
          {(Object.keys(CITIES) as CityId[]).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={city === id}
              onClick={() => setCity(id)}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
                city === id ? 'bg-haram text-white' : 'text-haram hover:bg-white'
              }`}
            >
              {bi(lang, CITIES[id].name)}
            </button>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-bold text-ink">{bi(lang, MAP_UI.chooseCategory)}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(Object.keys(CATEGORIES) as CategoryId[]).map((id) => {
            const active = category === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(active ? null : id)}
                className={`${tile} ${active ? 'bg-haram text-white' : 'bg-mist text-ink hover:bg-[#e2e9e4]'}`}
              >
                <CategoryIcon id={id} className="size-9" />
                {bi(lang, CATEGORIES[id].name)}
              </button>
            );
          })}
        </div>

        <h2 className="mt-9 text-lg font-bold text-ink">{bi(lang, MAP_UI.top)}</h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {visiblePlaces.map((p) => {
            const cat = CATEGORIES[p.category];
            const selected = selectedId === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  aria-current={selected}
                  className={`flex w-full items-start gap-3.5 px-2 py-4 text-left transition-colors ${selected ? 'bg-mist' : 'hover:bg-mist/60'}`}
                >
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full text-white" style={{ background: cat.color }}>
                    <CategoryIcon id={p.category} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-haram">{bi(lang, p.name)}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">{bi(lang, p.blurb)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-xs text-muted">{bi(lang, MAP_UI.attribution)}</p>
      </aside>
    </div>
  );
}
