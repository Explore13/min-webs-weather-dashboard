"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import type { ColorRule } from "@/lib/types"

interface ColorRuleEditorProps {
  polygonId: string
  colorRules: ColorRule[]
}

export function ColorRuleEditor({ polygonId, colorRules }: ColorRuleEditorProps) {
  const { updatePolygon } = useStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const addColorRule = () => {
    const newRule: ColorRule = {
      condition: '>= 0',
      color: '#6b7280'
    }
    updatePolygon(polygonId, {
      colorRules: [...colorRules, newRule]
    })
  }

  const updateColorRule = (index: number, updates: Partial<ColorRule>) => {
    const updatedRules = colorRules.map((rule, i) => 
      i === index ? { ...rule, ...updates } : rule
    )
    updatePolygon(polygonId, { colorRules: updatedRules })
  }

  const deleteColorRule = (index: number) => {
    const updatedRules = colorRules.filter((_, i) => i !== index)
    updatePolygon(polygonId, { colorRules: updatedRules })
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-start backdrop-blur-sm bg-white/30 border-blue-200/30 hover:bg-white/50 text-blue-700"
      >
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 mr-2" />
        ) : (
          <ChevronRight className="w-3 h-3 mr-2" />
        )}
        <Palette className="w-3 h-3 mr-2" />
        Color Rules ({colorRules.length})
      </Button>

      {isExpanded && (
        <Card className="backdrop-blur-sm bg-white/20 border-blue-200/30 border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs flex items-center gap-1 text-blue-800">
                <Palette className="w-3 h-3" />
                Temperature Rules
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={addColorRule}
                className="h-6 w-6 p-0 hover:bg-white/40 text-blue-600"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {colorRules.map((rule, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg backdrop-blur-sm bg-white/40 border border-blue-200/30"
              >
                <Input
                  value={rule.condition}
                  onChange={(e) => updateColorRule(index, { condition: e.target.value })}
                  placeholder="e.g., >= 25"
                  className="h-7 text-xs flex-1 bg-white/50 border-blue-200/30 text-blue-800"
                />
                <div className="relative">
                  <input
                    type="color"
                    value={rule.color}
                    onChange={(e) => updateColorRule(index, { color: e.target.value })}
                    className="w-7 h-7 rounded border-2 border-white shadow-sm cursor-pointer"
                  />
                  <div className="absolute inset-0 rounded border-2 border-blue-200/30 pointer-events-none" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteColorRule(index)}
                  className="h-7 w-7 p-0 hover:bg-white/40 text-blue-600 hover:text-blue-800"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            
            {colorRules.length === 0 && (
              <div className="text-center py-4">
                <Palette className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-xs text-blue-600">
                  No color rules defined
                </p>
                <p className="text-xs text-blue-500">
                  Click + to add temperature-based colors
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
