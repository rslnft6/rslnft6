import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import OSM_STYLE from './MapLibreOSMStyle';

interface MapViewProps {
  properties: any[];
}

const MapView: React.FC<MapViewProps> = ({ properties }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_STYLE,
      center: [31.2357, 30.0444],
      zoom: 5
    });
    properties.forEach((p: any) => {
      if (p.lng && p.lat) {
        // اختيار أيقونة حسب نوع الوحدة
        const iconUrl =
          p.type === 'palace' ? '/images/palace.jpg' :
          p.type === 'villa' ? '/images/villa.jpg' :
          p.type === 'apartment' ? '/images/apartment.jpg' :
          p.type === 'clinic' ? '/images/clinic.jpg' :
          p.type === 'shop' ? '/images/shop.jpg' :
          p.type === 'office' ? '/images/office.jpg' :
          '/images/logo1.png';
        const el = document.createElement('div');
        el.style.width = '44px';
        el.style.height = '44px';
        el.style.borderRadius = '50%';
        el.style.overflow = 'hidden';
        el.style.boxShadow = '0 2px 8px #888';
        el.style.border = '2px solid #00bcd4';
        el.style.background = '#fff';
        el.style.cursor = 'pointer';
        el.title = p.title;
        // صورة الأيقونة
        const img = document.createElement('img');
        img.src = iconUrl;
        img.alt = p.title;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        el.appendChild(img);
        // Popup عند الضغط
        el.onclick = (e) => {
          e.stopPropagation();
          const popup = new maplibregl.Popup({ offset: 18 })
            .setLngLat([p.lng, p.lat])
            .setHTML(`
              <div style='min-width:220px;max-width:260px;text-align:right'>
                <img src='${p.image || iconUrl}' alt='${p.title}' style='width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px' />
                <div style='font-weight:bold;color:#00bcd4;font-size:18px;margin-bottom:4px'>${p.title}</div>
                <div style='color:#ff9800;font-size:15px;margin-bottom:4px'>${p.location || ''}</div>
                <button style='background:#2196f3;color:#fff;border:none;border-radius:8px;padding:6px 18px;font-weight:bold;cursor:pointer;margin-top:8px' onclick="window.location.href='/property/${p.id}'">تفاصيل الوحدة</button>
              </div>
            `)
            .addTo(map);
        };
        new maplibregl.Marker(el).setLngLat([p.lng, p.lat]).addTo(map);
      }
    });
    return () => map.remove();
  }, [properties]);
  return <div ref={mapContainer} style={{width:'100%',height:400,borderRadius:16,margin:'32px 0',boxShadow:'0 2px 16px #e0e0e0'}} />;
};

export default MapView;
