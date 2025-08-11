# Weather Dashboard 🌤️

A modern, interactive weather dashboard built with Next.js, TypeScript, and HTML5 Canvas. Features real-time weather data visualization, polygon drawing capabilities, and temporal data analysis.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 🗺️ Interactive Map

- **Google Maps Integration**: Powered by Google Maps JavaScript API for accurate mapping
- **Interactive Controls**: Built-in zoom, pan, and navigation controls
- **Drawing Manager**: Google Maps Drawing Manager for polygon creation
- **Real-time Rendering**: Smooth map interactions with optimized performance
- **Responsive Design**: Adapts to different screen sizes and devices
- **Custom Styling**: Modern map styling with custom overlays and markers

### 📐 Polygon Drawing

- **Interactive Drawing**: Click-to-draw polygons with 3-12 vertices
- **Visual Feedback**: Real-time drawing indicators and hover effects
- **Polygon Management**: Create, edit, and delete polygons via sidebar
- **Persistence**: Automatic saving to localStorage

### 🕒 Timeline Control

- **Temporal Navigation**: 30-day range with hourly resolution
- **Dual Modes**: Single hour or time range selection
- **Smart Defaults**: Centered on current date with intuitive controls
- **Real-time Updates**: Weather data updates automatically with timeline changes

### 🌡️ Weather Integration

- **Open-Meteo API**: Real-time historical weather data
- **Temperature Mapping**: Color-coded polygons based on temperature rules
- **Data Caching**: Efficient API usage with intelligent caching
- **Error Handling**: Comprehensive error management and fallbacks

### 🎨 Color Rules System

- **Custom Thresholds**: User-defined temperature ranges
- **Color Picker**: Intuitive color selection interface
- **Multiple Rules**: Support for complex temperature mapping
- **Visual Preview**: Real-time color updates on map

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **pnpm** (recommended) or npm/yarn
- Modern web browser with Canvas support

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Explore13/mind-webs-weather-dashboard.git
   cd mind-webs-weather-dashboard
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory and add your Google Maps API key:

   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key_here
   ```

   To get a Google Maps API key:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Maps JavaScript API
   - Create credentials (API key)
   - Restrict the API key to your domain for production use

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🎯 Usage

### Getting Started

1. **Map Navigation**

   - Pan: Click and drag on the map
   - Zoom: Use +/- buttons or mouse wheel
   - Reset: Click reset button to return to Berlin center

2. **Drawing Polygons**

   - Click "Draw Polygon" button
   - Click on map to add vertices (minimum 3, maximum 12)
   - Double-click to complete or ESC to cancel
   - Polygon appears in sidebar for management

3. **Timeline Control**

   - Toggle between "Single Hour" and "Time Range" modes
   - Drag slider handles to select time period
   - Weather data updates automatically

4. **Color Rules**
   - Select polygon from sidebar
   - Expand "Color Rules" section
   - Add temperature thresholds and colors
   - Rules applied in order of definition

### Advanced Features

- **Keyboard Shortcuts**: ESC to cancel drawing, Space to reset view
- **Data Export**: Right-click polygons for export options
- **State Persistence**: All settings automatically saved
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Technology Stack

### Frontend

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS

### UI Components

- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI primitives
- **[Lucide React](https://lucide.dev/)** - Icon library

### State & Data

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[react-range](https://github.com/tajo/react-range)** - Timeline slider
- **HTML5 Canvas** - High-performance map rendering

### APIs & Services

- **[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)** - Interactive mapping and polygon drawing
- **[Open-Meteo API](https://open-meteo.com/)** - Weather data provider
- **Native Fetch** - HTTP client

## 📁 Project Structure

```
weather-dashboard/
├── app/                     # Next.js App Router
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout with font configuration
│   └── page.tsx            # Main dashboard page
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx      # Button component
│   │   ├── card.tsx        # Card component
│   │   ├── slider.tsx      # Slider component
│   │   └── ...             # Other UI components
│   ├── dashboard.tsx       # Main dashboard layout
│   ├── interactive-map.tsx # Canvas-based map component
│   ├── timeline-slider.tsx # Timeline control component
│   ├── sidebar.tsx         # Polygon management sidebar
│   ├── color-rule-editor.tsx # Color rules interface
│   └── drawing-handler.tsx # Polygon drawing logic
├── lib/                    # Utilities and configuration
│   ├── store.ts           # Zustand state management
│   ├── types.ts           # TypeScript type definitions
│   ├── weather-api.ts     # Weather API integration
│   └── utils.ts           # Utility functions
├── hooks/                  # Custom React hooks
│   ├── use-mobile.tsx     # Mobile detection hook
│   └── use-toast.ts       # Toast notification hook
├── public/                 # Static assets
│   └── ...                # Images and icons
└── styles/                # Additional styles
    └── globals.css        # Global CSS overrides
```

## 🔧 Development

### Environment Setup

1. **Clone and install dependencies** (see [Installation](#installation))

2. **Development commands**

   ```bash
   pnpm dev          # Start development server
   pnpm build        # Build for production
   pnpm start        # Start production server
   pnpm lint         # Run ESLint
   pnpm type-check   # Run TypeScript checks
   ```

3. **Code formatting**
   ```bash
   pnpm format       # Format code with Prettier
   ```

### Key Development Features

- **Hot Reload**: Instant updates during development
- **Type Safety**: Full TypeScript support with strict mode
- **ESLint**: Code quality and consistency checks
- **Tailwind CSS**: Utility-first styling with IntelliSense

### State Management Architecture

The application uses Zustand for state management with the following stores:

- **Map Store**: Canvas state, zoom, pan, and drawing mode
- **Timeline Store**: Selected time range and mode
- **Polygon Store**: Polygon data, color rules, and weather data
- **UI Store**: Sidebar state, loading states, and notifications

## 📡 API Documentation

### Open-Meteo Archive API

**Base URL**: `https://archive-api.open-meteo.com/v1/archive`

#### Get Historical Weather Data

```typescript
interface WeatherRequest {
  latitude: number;
  longitude: number;
  start_date: string; // YYYY-MM-DD format
  end_date: string; // YYYY-MM-DD format
  hourly: string[]; // ["temperature_2m"]
}

interface WeatherResponse {
  hourly: {
    time: string[]; // ISO datetime strings
    temperature_2m: number[]; // Temperature values in Celsius
  };
}
```

**Example Request**:

```bash
GET https://archive-api.open-meteo.com/v1/archive
  ?latitude=52.52
  &longitude=13.41
  &start_date=2025-07-01
  &end_date=2025-08-01
  &hourly=temperature_2m
```

### Rate Limits & Caching

- **Rate Limit**: 10,000 requests per day (free tier)
- **Caching Strategy**: Weather data cached for 1 hour
- **Error Handling**: Automatic retry with exponential backoff

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Configure build settings**:
   ```json
   {
     "buildCommand": "pnpm build",
     "outputDirectory": ".next",
     "installCommand": "pnpm install"
   }
   ```
3. **Deploy**: Automatic deployment on push to main

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Environment Variables

Create `.env.local` for local development:

```env
# Optional: Custom API endpoints
NEXT_PUBLIC_WEATHER_API_URL=https://archive-api.open-meteo.com/v1/archive
```

## 🧪 Testing

### Running Tests

```bash
pnpm test           # Run all tests
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Generate coverage report
```

### Test Structure

- **Unit Tests**: Individual component testing
- **Integration Tests**: API and state management testing
- **E2E Tests**: Full user workflow testing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style

- Follow TypeScript best practices
- Use descriptive variable and function names
- Add JSDoc comments for complex functions
- Maintain consistent code formatting

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather data API
- [shadcn/ui](https://ui.shadcn.com/) for the excellent component library
- [Vercel](https://vercel.com/) for hosting and deployment platform

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/Explore13/min-webs-weather-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Explore13/min-webs-weather-dashboard/discussions)

---

<div align="center">

**[⬆ Back to Top](#weather-dashboard-️)**

Made with ❤️ by [Explore13](https://github.com/Explore13)

</div>
