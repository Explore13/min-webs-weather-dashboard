"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Navigation } from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface LatLng {
  lat: number
  lng: number
}

export function InteractiveMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState<Point>({ x: 0, y: 0 })
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([])
  
  const { 
    mapCenter, 
    setMapCenter, 
    resetMapCenter, 
    isDrawing, 
    setIsDrawing, 
    polygons, 
    addPolygon,
    zoom,
    setZoom
  } = useStore()

  // Convert lat/lng to canvas coordinates
  const latLngToCanvas = useCallback((lat: number, lng: number, canvas: HTMLCanvasElement): Point => {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    // Simple mercator-like projection
    const scale = Math.pow(2, zoom) * 100
    const x = centerX + (lng - mapCenter.lng) * scale
    const y = centerY - (lat - mapCenter.lat) * scale * Math.cos(mapCenter.lat * Math.PI / 180)
    
    return { x, y }
  }, [mapCenter, zoom])

  // Convert canvas coordinates to lat/lng
  const canvasToLatLng = useCallback((x: number, y: number, canvas: HTMLCanvasElement): LatLng => {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    const scale = Math.pow(2, zoom) * 100
    const lng = mapCenter.lng + (x - centerX) / scale
    const lat = mapCenter.lat - (y - centerY) / (scale * Math.cos(mapCenter.lat * Math.PI / 180))
    
    return { lat, lng }
  }, [mapCenter, zoom])

  // Draw the map
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with blue gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#dbeafe')
    gradient.addColorStop(0.5, '#f8fafc')
    gradient.addColorStop(1, '#e0e7ff')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw subtle blue grid
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)'
    ctx.lineWidth = 1
    const gridSize = 50
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw center marker with blue styling
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Outer glow
    ctx.shadowColor = 'rgba(59, 130, 246, 0.4)'
    ctx.shadowBlur = 20
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI)
    ctx.fill()

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0

    // Inner circle
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI)
    ctx.fill()

    // Center dot
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI)
    ctx.fill()

    // Draw crosshair with blue gradient
    const crosshairGradient = ctx.createLinearGradient(centerX - 20, centerY, centerX + 20, centerY)
    crosshairGradient.addColorStop(0, 'rgba(59, 130, 246, 0)')
    crosshairGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.8)')
    crosshairGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
    
    ctx.strokeStyle = crosshairGradient
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 20, centerY)
    ctx.lineTo(centerX + 20, centerY)
    ctx.stroke()

    const verticalGradient = ctx.createLinearGradient(centerX, centerY - 20, centerX, centerY + 20)
    verticalGradient.addColorStop(0, 'rgba(59, 130, 246, 0)')
    verticalGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.8)')
    verticalGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
    
    ctx.strokeStyle = verticalGradient
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 20)
    ctx.lineTo(centerX, centerY + 20)
    ctx.stroke()
    
    // Draw existing polygons
    polygons.forEach(polygon => {
      const canvasPoints = polygon.coordinates.map(([lat, lng]) => 
        latLngToCanvas(lat, lng, canvas)
      )

      if (canvasPoints.length > 2) {
        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetY = 2

        // Fill polygon
        ctx.fillStyle = polygon.color + '40'
        ctx.beginPath()
        ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y)
        canvasPoints.slice(1).forEach(point => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.closePath()
        ctx.fill()

        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Stroke polygon
        ctx.strokeStyle = polygon.color
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw vertices
        canvasPoints.forEach(point => {
          ctx.shadowColor = polygon.color + '80'
          ctx.shadowBlur = 8
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
          ctx.fill()

          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.fillStyle = polygon.color
          ctx.beginPath()
          ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
          ctx.fill()
        })
      }
    })

    // Draw current drawing with blue styling
    if (isDrawing && drawingPoints.length > 0) {
      ctx.strokeStyle = '#3b82f6'
      ctx.fillStyle = '#3b82f6'
      ctx.lineWidth = 3

      // Draw points with glow
      drawingPoints.forEach(point => {
        ctx.shadowColor = 'rgba(59, 130, 246, 0.6)'
        ctx.shadowBlur = 10
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
        ctx.fill()

        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw lines
      if (drawingPoints.length > 1) {
        ctx.shadowColor = 'rgba(59, 130, 246, 0.3)'
        ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y)
        drawingPoints.slice(1).forEach(point => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.stroke()
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }

      // Draw closing line if we have enough points
      if (drawingPoints.length > 2) {
        ctx.setLineDash([8, 4])
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
        ctx.beginPath()
        ctx.moveTo(drawingPoints[drawingPoints.length - 1].x, drawingPoints[drawingPoints.length - 1].y)
        ctx.lineTo(drawingPoints[0].x, drawingPoints[0].y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    // Draw coordinates with blue styling
    ctx.fillStyle = 'rgba(30, 64, 175, 0.8)'
    ctx.font = '12px system-ui, -apple-system, sans-serif'
    ctx.fillText(`${mapCenter.lat.toFixed(4)}, ${mapCenter.lng.toFixed(4)}`, 16, 24)
    ctx.fillText(`Zoom: ${zoom}x`, 16, 42)
  }, [mapCenter, zoom, polygons, isDrawing, drawingPoints, latLngToCanvas])

  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isDrawing) {
      const newPoint = { x, y }
      const newPoints = [...drawingPoints, newPoint]
      setDrawingPoints(newPoints)

      // Complete polygon on double-click or after 12 points
      if (newPoints.length >= 12) {
        completePolygon(newPoints)
      }
    }
  }, [isDrawing, drawingPoints])

  // Handle double-click to complete polygon
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && drawingPoints.length >= 3) {
      completePolygon(drawingPoints)
    }
  }, [isDrawing, drawingPoints])

  // Complete polygon drawing
  const completePolygon = useCallback((points: Point[]) => {
    const canvas = canvasRef.current
    if (!canvas || points.length < 3) return

    const coordinates = points.map(point => {
      const latLng = canvasToLatLng(point.x, point.y, canvas)
      return [latLng.lat, latLng.lng] as [number, number]
    })

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

    setDrawingPoints([])
    setIsDrawing(false)
  }, [canvasToLatLng, addPolygon, setIsDrawing])

  // Handle mouse events for panning
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) return
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }, [isDrawing])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || isDrawing) return

    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y

    const scale = Math.pow(2, zoom) * 100
    const deltaLng = -deltaX / scale
    const deltaLat = deltaY / (scale * Math.cos(mapCenter.lat * Math.PI / 180))

    setMapCenter({
      lat: mapCenter.lat + deltaLat,
      lng: mapCenter.lng + deltaLng
    })

    setLastMousePos({ x: e.clientX, y: e.clientY })
  }, [isDragging, isDrawing, lastMousePos, mapCenter, zoom, setMapCenter])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.5 : 0.5
    const newZoom = Math.max(1, Math.min(5, zoom + delta))
    setZoom(newZoom)
  }, [zoom, setZoom])

  // Resize canvas
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      drawMap()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [drawMap])

  // Redraw when dependencies change
  useEffect(() => {
    drawMap()
  }, [drawMap])

  // Add this useEffect after the existing useEffects
  useEffect(() => {
    drawMap()
  }, [mapCenter, drawMap])

  // Cancel drawing on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawing) {
        setDrawingPoints([])
        setIsDrawing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawing, setIsDrawing])

  return (
    <div ref={containerRef} className="h-full w-full relative">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        onClick={handleCanvasClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDrawing ? 'crosshair' : isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Transparent Blue Map Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3">
        <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-2 shadow-lg border border-blue-200/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(5, zoom + 0.5))}
            className="w-10 h-10 p-0 hover:bg-white/40 text-blue-600 rounded-xl"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(1, zoom - 0.5))}
            className="w-10 h-10 p-0 hover:bg-white/40 text-blue-600 rounded-xl"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetMapCenter}
            className="w-10 h-10 p-0 hover:bg-white/40 text-blue-600 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Transparent Blue Drawing Instructions */}
      {isDrawing && (
        <div className="absolute bottom-6 left-6 backdrop-blur-xl bg-blue-500/80 rounded-2xl p-4 shadow-lg border border-blue-200/30 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4" />
            <p className="text-sm font-medium">Drawing Mode Active</p>
          </div>
          <p className="text-xs opacity-90 mb-1">
            Click to add points • Double-click to finish • ESC to cancel
          </p>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: Math.min(drawingPoints.length, 12) }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/60" />
              ))}
            </div>
            <span className="text-xs opacity-75">
              {drawingPoints.length}/12 points
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
