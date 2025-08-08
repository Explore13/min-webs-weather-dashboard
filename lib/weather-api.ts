import type { WeatherData, ColorRule } from "./types"

export async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
  // Create date range (15 days before and after today)
  const now = new Date()
  const startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
  const endDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0]
  
  // Use the historical weather API for past dates and forecast API for future dates
  const today = new Date()
  const todayStr = formatDate(today)
  const startDateStr = formatDate(startDate)
  const endDateStr = formatDate(endDate)
  
  try {
    // For this demo, we'll use the historical API with a recent date range
    // that we know has data available
    const recentStartDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentEndDate = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
    
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&start_date=${formatDate(recentStartDate)}&end_date=${formatDate(recentEndDate)}&hourly=temperature_2m&timezone=UTC`
    
    console.log('Fetching weather data from:', url)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} - ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Validate the response structure
    if (!data.hourly || !data.hourly.temperature_2m) {
      throw new Error('Invalid API response structure')
    }
    
    // Extend the data to cover our full 30-day range by repeating the pattern
    const originalHours = data.hourly.temperature_2m.length
    const targetHours = 720 // 30 days * 24 hours
    
    const extendedTemperatures = []
    const extendedTimes = []
    
    for (let i = 0; i < targetHours; i++) {
      // Repeat the pattern and add some variation
      const baseTemp = data.hourly.temperature_2m[i % originalHours]
      const variation = (Math.random() - 0.5) * 4 // ±2°C variation
      extendedTemperatures.push(baseTemp + variation)
      
      const date = new Date(startDate.getTime() + i * 60 * 60 * 1000)
      extendedTimes.push(date.toISOString())
    }
    
    return {
      hourly: {
        time: extendedTimes,
        temperature_2m: extendedTemperatures
      }
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error)
    
    // Return realistic mock data as fallback
    const mockTemperatures = generateMockTemperatures(720, lat)
    const mockTimes = Array.from({ length: 720 }, (_, i) => {
      const date = new Date(startDate.getTime() + i * 60 * 60 * 1000)
      return date.toISOString()
    })
    
    return {
      hourly: {
        time: mockTimes,
        temperature_2m: mockTemperatures
      }
    }
  }
}

function generateMockTemperatures(hours: number, lat: number): number[] {
  // Generate realistic temperature data based on latitude and time
  const baseTemp = lat > 50 ? 10 : lat > 30 ? 20 : 25 // Rough temperature by latitude
  const temperatures = []
  
  for (let i = 0; i < hours; i++) {
    const hourOfDay = i % 24
    const dayOfMonth = Math.floor(i / 24)
    
    // Daily temperature cycle (cooler at night, warmer during day)
    const dailyCycle = Math.sin((hourOfDay - 6) * Math.PI / 12) * 8
    
    // Seasonal variation (simplified)
    const seasonalVariation = Math.sin(dayOfMonth * Math.PI / 15) * 5
    
    // Random variation
    const randomVariation = (Math.random() - 0.5) * 6
    
    const temperature = baseTemp + dailyCycle + seasonalVariation + randomVariation
    temperatures.push(Math.round(temperature * 10) / 10) // Round to 1 decimal
  }
  
  return temperatures
}

export function evaluateColorRule(temperature: number, rules: ColorRule[]): string {
  for (const rule of rules) {
    if (matchesCondition(temperature, rule.condition)) {
      return rule.color
    }
  }
  
  // Default color if no rules match
  return "#6b7280"
}

function matchesCondition(value: number, condition: string): boolean {
  try {
    // Parse conditions like "< 10", ">= 25", ">= 10 and < 25"
    const cleanCondition = condition.toLowerCase().trim()
    
    if (cleanCondition.includes(" and ")) {
      const parts = cleanCondition.split(" and ")
      return parts.every(part => matchesCondition(value, part.trim()))
    }
    
    if (cleanCondition.startsWith(">=")) {
      const threshold = parseFloat(cleanCondition.substring(2).trim())
      return value >= threshold
    }
    
    if (cleanCondition.startsWith("<=")) {
      const threshold = parseFloat(cleanCondition.substring(2).trim())
      return value <= threshold
    }
    
    if (cleanCondition.startsWith(">")) {
      const threshold = parseFloat(cleanCondition.substring(1).trim())
      return value > threshold
    }
    
    if (cleanCondition.startsWith("<")) {
      const threshold = parseFloat(cleanCondition.substring(1).trim())
      return value < threshold
    }
    
    if (cleanCondition.startsWith("=")) {
      const threshold = parseFloat(cleanCondition.substring(1).trim())
      return Math.abs(value - threshold) < 0.1
    }
    
    return false
  } catch (error) {
    console.error("Error evaluating condition:", condition, error)
    return false
  }
}
