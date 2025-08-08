"use client"

import { useEffect, useRef } from "react"
import { useMap } from "react-leaflet"
import { useStore } from "@/lib/store"
import L from "leaflet"

export function DrawingHandler() {
  const map = useMap()
  const { isDrawing, setIsDrawing, addPolygon } = useStore()
  const drawingRef = useRef<{
    isDrawing: boolean
    points: L.LatLng[]
    tempMarkers: L.Marker[]
    tempPolyline?: L.Polyline
  }>({
    isDrawing: false,
    points: [],
    tempMarkers: []
  })

  useEffect(() => {
    if (!isDrawing) {
      // Clean up any temporary drawing elements
      drawingRef.current.tempMarkers.forEach(marker => map.removeLayer(marker))
      if (drawingRef.current.tempPolyline) {
        map.removeLayer(drawingRef.current.tempPolyline)
      }
      drawingRef.current = {
        isDrawing: false,
        points: [],
        tempMarkers: []
      }
      return
    }

    drawingRef.current.isDrawing = true

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!drawingRef.current.isDrawing) return

      const point = e.latlng
      drawingRef.current.points.push(point)

      // Add temporary marker
      const marker = L.marker(point).addTo(map)
      drawingRef.current.tempMarkers.push(marker)

      // Update temporary polyline
      if (drawingRef.current.tempPolyline) {
        map.removeLayer(drawingRef.current.tempPolyline)
      }
      
      if (drawingRef.current.points.length > 1) {
        drawingRef.current.tempPolyline = L.polyline(drawingRef.current.points, {
          color: '#3388ff',
          weight: 2,
          dashArray: '5, 5'
        }).addTo(map)
      }

      // Complete polygon on double-click or after 12 points
      if (drawingRef.current.points.length >= 3) {
        const handleDoubleClick = () => {
          completePolygon()
        }

        map.once('dblclick', handleDoubleClick)
        
        // Auto-complete after 12 points
        if (drawingRef.current.points.length >= 12) {
          setTimeout(completePolygon, 100)
        }
      }
    }

    const completePolygon = () => {
      if (drawingRef.current.points.length < 3) return

      const coordinates = drawingRef.current.points.map(point => [point.lat, point.lng] as [number, number])
      
      // Clean up temporary elements
      drawingRef.current.tempMarkers.forEach(marker => map.removeLayer(marker))
      if (drawingRef.current.tempPolyline) {
        map.removeLayer(drawingRef.current.tempPolyline)
      }

      // Add polygon to store
      addPolygon({
        coordinates,
        name: `Polygon ${Date.now()}`,
        dataSource: 'temperature_2m',
        colorRules: [
          { condition: '< 10', color: '#3b82f6' },
          { condition: '>= 10 and < 25', color: '#22c55e' },
          { condition: '>= 25', color: '#ef4444' }
        ]
      })

      // Reset drawing state
      drawingRef.current = {
        isDrawing: false,
        points: [],
        tempMarkers: []
      }
      setIsDrawing(false)
    }

    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
    }
  }, [isDrawing, map, setIsDrawing, addPolygon])

  return null
}
