"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Polygon, WeatherData } from "./types";
import { fetchWeatherData, evaluateColorRule } from "./weather-api";

interface AppState {
  timeRange: [number, number];
  setTimeRange: (range: [number, number]) => void;

  mapCenter: { lat: number; lng: number };
  setMapCenter: (center: { lat: number; lng: number }) => void;
  resetMapCenter: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;

  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;

  polygons: Polygon[];
  addPolygon: (polygon: Omit<Polygon, "id" | "color" | "currentValue">) => void;
  deletePolygon: (id: string) => void;
  updatePolygon: (id: string, updates: Partial<Polygon>) => void;

  weatherData: Record<string, WeatherData>;
  updatePolygonColors: () => Promise<void>;
  isLoadingWeather: boolean;
}

const DEFAULT_CENTER = { lat: 52.52, lng: 13.41 };

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      timeRange: [360, 360],
      setTimeRange: (range) => {
        set({ timeRange: range });
        setTimeout(() => get().updatePolygonColors(), 100);
      },

      mapCenter: DEFAULT_CENTER,
      setMapCenter: (center) => set({ mapCenter: center }),
      resetMapCenter: () =>
        set({
          mapCenter: DEFAULT_CENTER,
          zoom: 11,
        }),
      zoom: 11,
      setZoom: (zoom) => set({ zoom }),

      isDrawing: false,
      setIsDrawing: (drawing) => set({ isDrawing: drawing }),

      polygons: [],
      addPolygon: async (polygonData) => {
        const id = `polygon_${Date.now()}`;

        const defaultColorRules =
          polygonData.colorRules.length > 0
            ? polygonData.colorRules
            : [
                { condition: "< 10", color: "#ef4444" },
                { condition: ">= 10 and < 25", color: "#3b82f6" },
                { condition: ">= 25", color: "#22c55e" },
              ];

        const polygon: Polygon = {
          ...polygonData,
          id,
          colorRules: defaultColorRules,
          color: "#22c55e",
          currentValue: 0,
        };

        set((state) => ({
          polygons: [...state.polygons, polygon],
        }));

        get().updatePolygonColors();
      },

      deletePolygon: (id) => {
        set((state) => ({
          polygons: state.polygons.filter((p) => p.id !== id),
        }));
      },

      updatePolygon: (id, updates) => {
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));

        // Update colors if color rules changed
        if (updates.colorRules) {
          setTimeout(() => get().updatePolygonColors(), 100);
        }
      },

      // Weather data
      weatherData: {},
      isLoadingWeather: false,
      updatePolygonColors: async () => {
        const { polygons, timeRange, weatherData } = get();

        if (polygons.length === 0) return;

        set({ isLoadingWeather: true });

        try {
          for (const polygon of polygons) {
            try {
              // Calculate centroid of polygon
              const lats = polygon.coordinates.map((coord) => coord[0]);
              const lngs = polygon.coordinates.map((coord) => coord[1]);
              const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
              const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

              // Validate coordinates
              if (isNaN(centerLat) || isNaN(centerLng)) {
                console.warn(`Invalid coordinates for polygon ${polygon.id}`);
                continue;
              }

              // Fetch weather data if not cached
              const cacheKey = `${centerLat.toFixed(2)}_${centerLng.toFixed(
                2
              )}`;
              let data = weatherData[cacheKey];

              if (!data) {
                console.log(
                  `Fetching weather data for polygon ${polygon.id} at ${centerLat}, ${centerLng}`
                );
                data = await fetchWeatherData(centerLat, centerLng);
                set((state) => ({
                  weatherData: { ...state.weatherData, [cacheKey]: data },
                }));
              }

              // Validate time range indices
              const maxIndex = data.hourly.temperature_2m.length - 1;
              const startIndex = Math.max(0, Math.min(timeRange[0], maxIndex));
              const endIndex = Math.max(0, Math.min(timeRange[1], maxIndex));

              // Calculate average temperature for time range
              let avgTemp = 0;
              if (startIndex === endIndex) {
                // Single hour
                avgTemp = data.hourly.temperature_2m[startIndex] || 0;
              } else {
                // Range of hours
                const temps = data.hourly.temperature_2m.slice(
                  startIndex,
                  endIndex + 1
                );
                avgTemp =
                  temps.length > 0
                    ? temps.reduce((a, b) => a + b, 0) / temps.length
                    : 0;
              }

              // Apply color rules
              const color = evaluateColorRule(avgTemp, polygon.colorRules);

              // Update polygon
              set((state) => ({
                polygons: state.polygons.map((p) =>
                  p.id === polygon.id
                    ? { ...p, color, currentValue: avgTemp }
                    : p
                ),
              }));
            } catch (error) {
              console.error(`Failed to update polygon ${polygon.id}:`, error);
              // Set a default color for failed polygons
              set((state) => ({
                polygons: state.polygons.map((p) =>
                  p.id === polygon.id
                    ? { ...p, color: "#6b7280", currentValue: 0 }
                    : p
                ),
              }));
            }
          }
        } finally {
          set({ isLoadingWeather: false });
        }
      },
    }),
    {
      name: "dashboard-storage",
      partialize: (state) => ({
        polygons: state.polygons,
        mapCenter: state.mapCenter,
        timeRange: state.timeRange,
        zoom: state.zoom,
      }),
    }
  )
);
