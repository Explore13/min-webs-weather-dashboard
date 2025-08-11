"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Polygon, Marker } from "@react-google-maps/api";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Navigation } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export function InteractiveMapCore() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const tempPolygonRef = useRef<google.maps.Polygon | null>(null);
  const tempPathRef = useRef<google.maps.LatLngLiteral[]>([]);
  const [pointCount, setPointCount] = useState(0);
  const [hoverLatLng, setHoverLatLng] =
    useState<google.maps.LatLngLiteral | null>(null);

  const store = useStore();
  const {
    mapCenter,
    setMapCenter,
    zoom,
    setZoom,
    resetMapCenter,
    polygons,
    addPolygon,
    deletePolygon,
    isDrawing,
    setIsDrawing,
  } = store;

  const onPolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      try {
        const path = polygon.getPath().getArray();
        const coordinates = path.map(
          (latLng) => [latLng.lat(), latLng.lng()] as [number, number]
        );

        if (coordinates.length < 3) {
          console.warn("Polygon must have at least 3 points");
          return;
        }

        const normalizedPath = coordinates.map(
          ([lat, lng]) =>
            [lat, lng > 180 ? lng - 360 : lng < -180 ? lng + 360 : lng] as [
              number,
              number
            ]
        );

        addPolygon({
          coordinates: normalizedPath,
          name: `Polygon ${Date.now()}`,
          dataSource: "Open-Meteo",
          colorRules: [
            { condition: "< 10", color: "#3b82f6" },
            { condition: ">= 10 and < 25", color: "#22c55e" },
            { condition: ">= 25", color: "#ef4444" },
          ],
        });

        console.log(`Polygon created with ${coordinates.length} points`);
      } catch (err) {
        console.error("Error onPolygonComplete:", err);
      } finally {
        try {
          polygon.setMap(null);
        } catch {}
        setIsDrawing(false);
      }
    },
    [addPolygon, setIsDrawing]
  );

  const finalizePolygon = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const path = tempPathRef.current;
    if (path.length < 3) {
      if (tempPolygonRef.current) {
        tempPolygonRef.current.setMap(null);
        tempPolygonRef.current = null;
      }
      tempPathRef.current = [];
      setPointCount(0);
      return;
    }

    const handoffPolygon = new google.maps.Polygon({
      paths: path,
      map,
      clickable: false,
      geodesic: false,
    });

    onPolygonComplete(handoffPolygon);

    if (tempPolygonRef.current) {
      tempPolygonRef.current.setMap(null);
      tempPolygonRef.current = null;
    }
    tempPathRef.current = [];
    setPointCount(0);
  }, [onPolygonComplete]);

  const cancelDrawing = useCallback(() => {
    if (tempPolygonRef.current) {
      tempPolygonRef.current.setMap(null);
      tempPolygonRef.current = null;
    }
    tempPathRef.current = [];
    setPointCount(0);
    setIsDrawing(false);
  }, [setIsDrawing]);

  const onLoadMap = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      map.addListener("dragend", () => {
        const center = map.getCenter();
        if (center) setMapCenter({ lat: center.lat(), lng: center.lng() });
      });

      map.addListener("zoom_changed", () => {
        const currentZoom = map.getZoom();
        if (typeof currentZoom === "number") setZoom(currentZoom);
      });

      setTimeout(() => {
        if (typeof google !== "undefined")
          google.maps.event.trigger(map, "resize");
      }, 150);
    },
    [setMapCenter, setZoom]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    if (
      center &&
      (Math.abs(center.lat() - mapCenter.lat) > 1e-6 ||
        Math.abs(center.lng() - mapCenter.lng) > 1e-6)
    ) {
      map.setCenter(mapCenter);
    }
  }, [mapCenter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.getZoom() !== zoom) map.setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let clickListener: google.maps.MapsEventListener | null = null;
    let dblClickListener: google.maps.MapsEventListener | null = null;
    let mouseMoveListener: google.maps.MapsEventListener | null = null;
    let keyHandler = (ev: KeyboardEvent) => {};
    if (isDrawing) {
      if (!tempPolygonRef.current) {
        tempPolygonRef.current = new google.maps.Polygon({
          paths: tempPathRef.current,
          map,
          strokeColor: "#00acc1",
          strokeWeight: 2,
          fillColor: "#00bcd4",
          fillOpacity: 0.25,
          clickable: false,
          geodesic: false,
        });
      }

      mouseMoveListener = map.addListener(
        "mousemove",
        (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            setHoverLatLng(e.latLng.toJSON());
          }
        }
      );

      clickListener = map.addListener(
        "click",
        (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const latLng = e.latLng.toJSON();
          tempPathRef.current.push(latLng);
          tempPolygonRef.current?.setPath(tempPathRef.current);
          const currentPoints = tempPathRef.current.length;
          setPointCount(currentPoints);

          if (currentPoints >= 12) {
            finalizePolygon();
          }
        }
      );

      dblClickListener = map.addListener("dblclick", () => {
        if (tempPathRef.current.length >= 3) finalizePolygon();
      });

      keyHandler = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") cancelDrawing();
      };
      window.addEventListener("keydown", keyHandler);

      return () => {
        if (clickListener) google.maps.event.removeListener(clickListener);
        if (dblClickListener)
          google.maps.event.removeListener(dblClickListener);
        if (mouseMoveListener)
          google.maps.event.removeListener(mouseMoveListener);
        window.removeEventListener("keydown", keyHandler);
        setHoverLatLng(null);
      };
    } else {
      if (tempPolygonRef.current) {
        tempPolygonRef.current.setMap(null);
        tempPolygonRef.current = null;
      }
      tempPathRef.current = [];
      setPointCount(0);
      setHoverLatLng(null);
    }
  }, [isDrawing, finalizePolygon, cancelDrawing]);

  useEffect(() => {
    return () => {
      if (mapRef.current && typeof google !== "undefined") {
        google.maps.event.clearInstanceListeners(mapRef.current);
      }
      if (tempPolygonRef.current) {
        tempPolygonRef.current.setMap(null);
        tempPolygonRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          mapTypeId="roadmap"
          center={mapCenter}
          zoom={zoom}
          onLoad={onLoadMap}
          options={{
            disableDefaultUI: true,
            gestureHandling: "greedy",
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            minZoom: 3,
            maxZoom: 18,
            restriction: {
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180,
              },
              strictBounds: true,
            },
            backgroundColor: "#e5e5e5",
            tilt: 0,
          }}
        >
          {polygons.map((poly) => (
            <Polygon
              key={poly.id}
              paths={poly.coordinates.map((c) => ({ lat: c[0], lng: c[1] }))}
              options={{
                strokeColor: poly.color || "#ff0000",
                strokeWeight: 2,
                fillColor: poly.color || "#ff0000",
                fillOpacity: 0.6,
                clickable: true,
                geodesic: false,
              }}
              onRightClick={() => deletePolygon(poly.id)}
            />
          ))}

          {/* Hover preview point */}
          {isDrawing && hoverLatLng && tempPathRef.current.length < 12 && (
            <Marker
              position={hoverLatLng}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#007bff",
                fillOpacity: 0.8,
                strokeWeight: 0,
              }}
              clickable={false}
              draggable={false}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {/* Coordinates */}
      <div className="absolute left-4 top-4 z-20 bg-white/30 backdrop-blur-md rounded-md px-3 py-2 border border-blue-200/30">
        <div className="text-xs text-blue-800">
          {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
        </div>
        <div className="text-xs text-blue-700 opacity-90">Zoom: {zoom}x</div>
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
        <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-2 shadow-lg border border-blue-200/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newZ = Math.min(18, (zoom || 10) + 1);
              setZoom(newZ);
              mapRef.current?.setZoom(newZ);
            }}
            className="w-10 h-10 p-0 hover:bg-white/40 text-blue-600 rounded-xl"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newZ = Math.max(3, (zoom || 10) - 1);
              setZoom(newZ);
              mapRef.current?.setZoom(newZ);
            }}
            className="w-10 h-10 p-0 hover:bg-white/40 text-blue-600 rounded-xl"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetMapCenter();
              mapRef.current?.setCenter(mapCenter);
              mapRef.current?.setZoom(10);
            }}
            className="w-10 h-10 p-0 hover:bg-white/40 text-blue-600 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Drawing overlay */}
      {isDrawing && (
        <div className="absolute bottom-6 left-6 backdrop-blur-xl bg-blue-500/80 rounded-2xl p-4 shadow-lg border border-blue-200/30 text-white z-20">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4" />
            <p className="text-sm font-medium">Drawing Mode Active</p>
          </div>
          <p className="text-xs opacity-90 mb-1">
            Click to add points (max 12) • Double-click to finish • ESC to
            cancel
          </p>
          {pointCount > 0 && (
            <p className="text-xs font-medium">Points: {pointCount}/12</p>
          )}
        </div>
      )}
    </div>
  );
}
