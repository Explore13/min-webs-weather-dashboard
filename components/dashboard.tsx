"use client";

import { useState } from "react";
import { TimelineSlider } from "./timeline-slider";
import { InteractiveMap } from "./interactive-map";
import { Sidebar } from "./sidebar";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

export function Dashboard() {
  const { resetMapCenter, isDrawing, setIsDrawing, setZoom } = useStore();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="relative border-b border-blue-200/30 backdrop-blur-xl bg-white/20 p-4 lg:p-6 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-blue-900">
                  Weather Dashboard
                </h1>
                <p className="text-xs lg:text-sm text-blue-600">
                  Interactive climate visualization
                </p>
              </div>
            </div>
            <div className="flex gap-2 lg:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetMapCenter();
                  setZoom(3);
                }}
                className="backdrop-blur-sm bg-white/30 border-blue-200/30 hover:bg-white/50 text-blue-700 hover:text-blue-800 transition-all duration-200 flex-1 sm:flex-none"
              >
                <RotateCcw className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Reset View</span>
              </Button>
              <Button
                variant={isDrawing ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsDrawing(!isDrawing)}
                className={
                  isDrawing
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex-1 sm:flex-none"
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex-1 sm:flex-none"
                }
              >
                {isDrawing ? "Cancel Drawing" : "Draw Polygon"}
              </Button>
            </div>
          </div>
          <TimelineSlider />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="h-[60vh] lg:h-full w-full lg:flex-1 order-1 p-2">
          <InteractiveMap />
        </div>
        <div className="h-[40vh] lg:h-full order-2 mt-5 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
