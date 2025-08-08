# Interactive Weather Dashboard

A full-featured React dashboard for visualizing weather data with interactive maps, polygon drawing, and timeline controls.

## Features

🕒 **Timeline Slider**
- Horizontal timeline with hourly resolution
- 30-day range (15 days before/after today)
- Single hour or time range selection modes
- Clear date/time labels

🗺️ **Interactive Map**
- Custom canvas-based mapping system
- Zoom controls (1x to 5x)
- Pan and center reset functionality
- Polygon drawing and persistence
- Grid overlay for better spatial reference

📐 **Polygon Drawing**
- Click to draw polygons with 3-12 points
- Double-click or auto-complete after 12 points
- Visual feedback during drawing
- ESC key to cancel drawing
- Polygon management in sidebar

📊 **Data Integration**
- Open-Meteo weather API integration
- Real-time temperature data fetching
- Color-coded polygons based on temperature rules
- Dynamic updates with timeline changes

🎨 **Color Rules System**
- Custom temperature thresholds
- User-defined color mapping
- Multiple rules per polygon
- Visual color picker interface

⚙️ **Advanced Features**
- Persistent state with localStorage
- Responsive design
- Real-time polygon color updates
- Comprehensive error handling
- Canvas-based rendering for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd interactive-weather-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Keys

This project uses the Open-Meteo API which is free and doesn't require an API key. The weather data is fetched from:
- **Open-Meteo Archive API**: `https://archive-api.open-meteo.com/v1/archive`

For production use, consider:
- Rate limiting implementation
- Caching strategies
- Error handling for API failures

## Technology Stack

### Core Technologies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Styling

### UI Components
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icons

### State Management
- **Zustand** - Lightweight state management
- **Zustand Persist** - State persistence

### Mapping & Visualization
- **HTML5 Canvas** - Custom map rendering
- **react-range** - Timeline slider component

### Data & API
- **Open-Meteo API** - Weather data source
- **Native Fetch** - HTTP requests

## Map Controls

### Navigation
- **Pan**: Click and drag to move around the map
- **Zoom**: Use zoom controls or mouse wheel
- **Reset**: Click reset button to return to Berlin center

### Drawing Polygons
1. Click "Draw Polygon" button
2. Click on the map to add points (3-12 points)
3. Double-click to complete the polygon
4. Press ESC to cancel drawing

### Map Features
- Grid overlay for spatial reference
- Center marker (red crosshair)
- Coordinate display
- Zoom level indicator

## Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard.tsx        # Main dashboard layout
│   ├── timeline-slider.tsx  # Timeline control
│   ├── interactive-map.tsx  # Canvas-based map
│   ├── sidebar.tsx          # Sidebar panel
│   └── color-rule-editor.tsx # Color rules UI
├── lib/
│   ├── store.ts             # Zustand store
│   ├── types.ts             # TypeScript types
│   ├── weather-api.ts       # API integration
│   └── utils.ts             # Utility functions
└── README.md
\`\`\`

## Usage Guide

### Drawing Polygons

1. Click "Draw Polygon" button
2. Click on the map to add points (3-12 points)
3. Double-click to complete the polygon
4. Polygon automatically gets weather data and color coding

### Timeline Control

1. Use "Single Hour" for point-in-time data
2. Use "Time Range" for averaged data over multiple hours
3. Drag slider handles to select time period
4. Polygons update colors automatically

### Color Rules

1. Click on a polygon in the sidebar
2. Expand "Color Rules" section
3. Add/edit temperature thresholds
4. Choose colors for each condition
5. Rules are applied in order

### Map Navigation

- **Pan**: Click and drag to move around
- **Zoom**: Use + and - buttons or mouse wheel
- **Reset**: Click reset button to return to center

## API Reference

### Open-Meteo Archive API

**Endpoint**: `https://archive-api.open-meteo.com/v1/archive`

**Parameters**:
- `latitude`: Latitude coordinate
- `longitude`: Longitude coordinate  
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `hourly`: Weather variables (temperature_2m)

**Example**:
\`\`\`
https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2025-07-18&end_date=2025-08-01&hourly=temperature_2m
\`\`\`

## Performance Features

- **Canvas Rendering**: Efficient drawing with HTML5 Canvas
- **State Persistence**: Automatic saving to localStorage
- **API Caching**: Weather data cached to reduce requests
- **Optimized Updates**: Smart re-rendering only when needed

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include browser/OS information for bugs

---

Built with ❤️ using React, TypeScript, and HTML5 Canvas.
