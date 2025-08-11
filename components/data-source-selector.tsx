"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Database, Thermometer } from "lucide-react";

interface DataSourceSelectorProps {
  isOpen: boolean;
  onSelect: (dataSource: string) => void;
  onCancel: () => void;
}

const DATA_SOURCES = [
  {
    id: "open-meteo",
    name: "Open-Meteo",
    description: "Historical weather data with temperature readings",
    icon: Thermometer,
    field: "temperature_2m",
  },
];

export function DataSourceSelector({
  isOpen,
  onSelect,
  onCancel,
}: DataSourceSelectorProps) {
  const [selectedSource, setSelectedSource] = useState(DATA_SOURCES[0].id);

  const handleConfirm = () => {
    const source = DATA_SOURCES.find((s) => s.id === selectedSource);
    onSelect(source?.name || "Manual");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-xl bg-white/90 border-blue-200/30">
        <DialogHeader>
          <DialogTitle className="text-blue-900">
            Select Data Source
          </DialogTitle>
          <DialogDescription className="text-blue-700">
            Choose a data source to tag this polygon with weather or other data.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedSource} onValueChange={setSelectedSource}>
            {DATA_SOURCES.map((source) => {
              const Icon = source.icon;
              return (
                <div
                  key={source.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-blue-200/30 bg-white/30"
                >
                  <RadioGroupItem
                    value={source.id}
                    id={source.id}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={source.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {source.name}
                      </span>
                    </Label>
                    <p className="text-xs text-blue-600 mt-1">
                      {source.description}
                    </p>
                    <p className="text-xs text-blue-500 mt-1 font-mono">
                      {source.field}
                    </p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-blue-200/30"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
