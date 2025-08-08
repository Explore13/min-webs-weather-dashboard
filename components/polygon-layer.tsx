"use client"

import { Polygon, Popup } from "react-leaflet"
import { useStore } from "@/lib/store"

export function PolygonLayer() {
  const { polygons, deletePolygon } = useStore()

  return (
    <>
      {polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={polygon.coordinates}
          pathOptions={{
            color: polygon.color,
            fillColor: polygon.color,
            fillOpacity: 0.6,
            weight: 2
          }}
        >
          <Popup>
            <div className="space-y-2">
              <h3 className="font-semibold">{polygon.name}</h3>
              <p className="text-sm text-muted-foreground">
                Data Source: {polygon.dataSource}
              </p>
              <p className="text-sm">
                Current Temperature: {polygon.currentValue?.toFixed(1)}°C
              </p>
              <button
                onClick={() => deletePolygon(polygon.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete Polygon
              </button>
            </div>
          </Popup>
        </Polygon>
      ))}
    </>
  )
}
