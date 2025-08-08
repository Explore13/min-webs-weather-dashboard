"use client"

import { useState } from "react"
import { Range, getTrackBackground } from "react-range"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from 'lucide-react'

export function TimelineSlider() {
  const { timeRange, setTimeRange } = useStore()
  const [mode, setMode] = useState<"single" | "range">("single")

  // Create 30-day range (15 days before and after today)
  const now = new Date()
  const startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
  const endDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
  
  // Total hours in range
  const totalHours = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
  
  const formatDateTime = (hourIndex: number) => {
    const date = new Date(startDate.getTime() + hourIndex * 60 * 60 * 1000)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getCurrentHourIndex = () => {
    return Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60))
  }

  const values = mode === "single" ? [timeRange[0]] : timeRange

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={mode === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("single")
              setTimeRange([timeRange[0], timeRange[0]])
            }}
            className={mode === "single" 
              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg" 
              : "backdrop-blur-sm bg-white/30 border-blue-200/30 hover:bg-white/50 text-blue-700"
            }
          >
            <Clock className="w-3 h-3 mr-1" />
            Single Hour
          </Button>
          <Button
            variant={mode === "range" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("range")}
            className={mode === "range" 
              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg" 
              : "backdrop-blur-sm bg-white/30 border-blue-200/30 hover:bg-white/50 text-blue-700"
            }
          >
            <Calendar className="w-3 h-3 mr-1" />
            Time Range
          </Button>
        </div>
        <div className="flex gap-2">
          {mode === "single" ? (
            <Badge 
              variant="secondary" 
              className="backdrop-blur-sm bg-white/40 border-blue-200/30 text-blue-700"
            >
              {formatDateTime(timeRange[0])}
            </Badge>
          ) : (
            <>
              <Badge 
                variant="secondary" 
                className="backdrop-blur-sm bg-white/40 border-blue-200/30 text-blue-700"
              >
                From: {formatDateTime(timeRange[0])}
              </Badge>
              <Badge 
                variant="secondary" 
                className="backdrop-blur-sm bg-white/40 border-blue-200/30 text-blue-700"
              >
                To: {formatDateTime(timeRange[1])}
              </Badge>
            </>
          )}
        </div>
      </div>

      <div className="px-4">
        <Range
          values={values}
          step={1}
          min={0}
          max={totalHours - 1}
          onChange={(values) => {
            if (mode === "single") {
              setTimeRange([values[0], values[0]])
            } else {
              setTimeRange([values[0], values[1] || values[0]])
            }
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "36px",
                display: "flex",
                width: "100%"
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "8px",
                  width: "100%",
                  borderRadius: "12px",
                  background: getTrackBackground({
                    values,
                    colors: mode === "single" 
                      ? ["#e2e8f0", "#3b82f6", "#e2e8f0"]
                      : ["#e2e8f0", "#3b82f6", "#e2e8f0"],
                    min: 0,
                    max: totalHours - 1
                  }),
                  alignSelf: "center",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, isDragged }) => {
            const { key, ...restProps } = props
            return (
              <div
                key={key}
                {...restProps}
                style={{
                  ...restProps.style,
                  height: "24px",
                  width: "24px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: isDragged 
                    ? "0 8px 25px rgba(59, 130, 246, 0.4), 0 0 0 4px rgba(59, 130, 246, 0.1)" 
                    : "0 4px 15px rgba(59, 130, 246, 0.3)",
                  border: "2px solid white",
                  transition: "all 0.2s ease"
                }}
              >
                <div
                  style={{
                    height: "8px",
                    width: "8px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    opacity: isDragged ? 1 : 0.8
                  }}
                />
              </div>
            )
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-blue-600 px-4">
        <span className="backdrop-blur-sm bg-white/30 px-2 py-1 rounded-md">
          {formatDateTime(0)}
        </span>
        <span className="font-medium backdrop-blur-sm bg-white/40 px-3 py-1 rounded-md border border-blue-200/30">
          Now: {formatDateTime(getCurrentHourIndex())}
        </span>
        <span className="backdrop-blur-sm bg-white/30 px-2 py-1 rounded-md">
          {formatDateTime(totalHours - 1)}
        </span>
      </div>
    </div>
  )
}
