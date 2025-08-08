export interface ColorRule {
  condition: string // e.g., "< 10", ">= 25", ">= 10 and < 25"
  color: string // hex color
}

export interface Polygon {
  id: string
  name: string
  coordinates: [number, number][] // [lat, lng] pairs
  dataSource: string
  colorRules: ColorRule[]
  color: string // Current applied color
  currentValue?: number // Current temperature value
}

export interface WeatherData {
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
}
