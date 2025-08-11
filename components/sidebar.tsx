"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trash2,
  Edit,
  Palette,
  Loader2,
  Database,
  Thermometer,
  MapPin,
} from "lucide-react";
import { ColorRuleEditor } from "./color-rule-editor";

export function Sidebar() {
  const { polygons, deletePolygon, updatePolygon, isLoadingWeather } =
    useStore();
  const [editingPolygon, setEditingPolygon] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleNameEdit = (polygonId: string, currentName: string) => {
    setEditingPolygon(polygonId);
    setEditingName(currentName);
  };

  const handleNameSave = (polygonId: string) => {
    updatePolygon(polygonId, { name: editingName });
    setEditingPolygon(null);
    setEditingName("");
  };

  return (
    <div className="w-80 relative">
      <div className="absolute inset-0 backdrop-blur-xl bg-white/20 border-l border-blue-200/30" />

      <div className="relative z-10 p-6 h-full overflow-y-auto">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-blue-900">
                Data Sources
              </h2>
            </div>

            <Card className="backdrop-blur-sm bg-white/30 border-blue-200/30 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500">
                    <Thermometer className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-blue-800">Open-Meteo</span>
                  {isLoadingWeather && (
                    <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Badge
                  variant="secondary"
                  className="backdrop-blur-sm bg-white/40 border-blue-200/30 text-blue-700"
                >
                  temperature_2m
                </Badge>
                <p className="text-xs text-blue-600">
                  Historical weather data with intelligent fallback
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-blue-900">
                Polygons ({polygons.length})
              </h2>
            </div>

            {polygons.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/40 backdrop-blur-sm border border-blue-200/30 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  No polygons drawn yet
                </p>
                <p className="text-xs text-blue-600">
                  Click "Draw Polygon" to start mapping weather data
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {polygons.map((polygon, index) => (
                  <Card
                    key={polygon.id}
                    className="backdrop-blur-sm bg-white/30 border-blue-200/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white/40"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        {editingPolygon === polygon.id ? (
                          <div className="flex-1 flex gap-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8 backdrop-blur-sm bg-white/40 border-blue-200/30 text-blue-800"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleNameSave(polygon.id);
                                }
                                if (e.key === "Escape") {
                                  setEditingPolygon(null);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleNameSave(polygon.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: polygon.color }}
                              />
                              <CardTitle className="text-sm text-blue-800">
                                {polygon.name}
                              </CardTitle>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleNameEdit(polygon.id, polygon.name)
                                }
                                className="h-8 w-8 p-0 hover:bg-white/40 text-blue-600"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePolygon(polygon.id)}
                                className="h-8 w-8 p-0 hover:bg-white/40 text-blue-600 hover:text-blue-800"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded border-2 border-white shadow-sm"
                            style={{ backgroundColor: polygon.color }}
                          />
                          {isLoadingWeather ? (
                            <Skeleton className="h-4 w-16 bg-white/40" />
                          ) : (
                            <span className="text-sm font-medium text-blue-800">
                              {polygon.currentValue?.toFixed(1) || "0.0"}°C
                            </span>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs backdrop-blur-sm bg-white/30 border-blue-200/30 text-blue-700"
                        >
                          {polygon.coordinates.length} points
                        </Badge>
                      </div>

                      <div className="text-xs text-blue-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          <span>Source: {polygon.dataSource}</span>
                        </div>
                      </div>

                      <ColorRuleEditor
                        polygonId={polygon.id}
                        colorRules={polygon.colorRules}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
