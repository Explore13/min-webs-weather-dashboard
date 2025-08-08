"use client"

import { useState } from "react"
import { TimelineSlider } from "./timeline-slider"
import { InteractiveMap } from "./interactive-map"
import { Sidebar } from "./sidebar"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { RotateCcw, Zap } from 'lucide-react'

export function Dashboard() {
  const { resetMapCenter, isDrawing, setIsDrawing, setZoom } = useStore()

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header with Timeline - Transparent Glass Effect */}
      <div className="relative border-b border-blue-200/30 backdrop-blur-xl bg-white/20 p-6 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">
                  Weather Dashboard
                </h1>
                <p className="text-sm text-blue-600">
                  Interactive climate visualization
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetMapCenter()
                  setZoom(3)
                }}
                className="backdrop-blur-sm bg-white/30 border-blue-200/30 hover:bg-white/50 text-blue-700 hover:text-blue-800 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
              <Button
                variant={isDrawing ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsDrawing(!isDrawing)}
                className={isDrawing 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                }
              >
                {isDrawing ? "Cancel Drawing" : "Draw Polygon"}
              </Button>
            </div>
          </div>
          <TimelineSlider />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        <div className="flex-1 relative">
          <InteractiveMap />
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
