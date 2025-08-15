# Air Quality Prediction Dashboard

A modern Next.js web application for visualizing and predicting air quality using machine learning models.

## Features

- 📊 **Interactive Dashboard**: Real-time air quality statistics and visualizations
- 🗺️ **Interactive Map**: Geographic visualization of air quality data points
- 🤖 **ML Predictions**: Air quality prediction using trained models
- 📈 **Data Visualization**: Charts and graphs for air quality metrics
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **Data**: CSV file processing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Air_quality_prediction/
├── app/
│   ├── api/
│   │   ├── air-quality-data/
│   │   │   └── route.ts          # API endpoint for air quality data
│   │   └── predict/
│   │       └── route.ts          # API endpoint for predictions
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main dashboard page
├── AQI-and-Lat-Long-of-Countries.csv  # Air quality dataset
├── app.py                        # Original Python model training
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
└── README.md                    # This file
```

## Features Overview

### 1. Dashboard Statistics
- Average, Maximum, and Minimum AQI values
- Total number of data points
- Real-time calculations from the dataset

### 2. Interactive Charts
- Bar charts showing average pollutant levels
- Visual representation of CO, Ozone, NO2, and PM2.5 data

### 3. Prediction Interface
- Input form for air quality parameters
- Real-time AQI predictions
- Color-coded results based on air quality categories

### 4. Interactive Map
- Geographic visualization of air quality data
- Clickable markers with detailed information
- Worldwide coverage of air quality monitoring stations

## Air Quality Categories

- **Good (0-50)**: Green - Air quality is satisfactory
- **Moderate (51-100)**: Yellow - Air quality is acceptable
- **Unhealthy for Sensitive Groups (101-150)**: Orange - Some pollutants may be a concern
- **Unhealthy (151-200)**: Red - Everyone may begin to experience health effects
- **Very Unhealthy (201-300)**: Purple - Health warnings of emergency conditions
- **Hazardous (301+)**: Maroon - Health alert: everyone may experience more serious health effects

## API Endpoints

### GET /api/air-quality-data
Returns all air quality data from the CSV file.

**Response:**
```json
[
  {
    "AQI Value": 51,
    "CO AQI Value": 1,
    "Ozone AQI Value": 36,
    "NO2 AQI Value": 0,
    "PM2.5 AQI Value": 51,
    "lat": 44.7444,
    "lng": 44.2031
  }
]
```

### POST /api/predict
Makes air quality predictions based on input parameters.

**Request:**
```json
{
  "co": 1,
  "ozone": 30,
  "no2": 5,
  "pm25": 25,
  "lat": 40.7128,
  "lng": -74.0060
}
```

**Response:**
```json
{
  "prediction": 45,
  "inputs": {
    "co": 1,
    "ozone": 30,
    "no2": 5,
    "pm25": 25,
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Charts**: Add components in `app/page.tsx` using Recharts
2. **New API Endpoints**: Create new files in `app/api/`
3. **Styling**: Modify `tailwind.config.js` for custom styles

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Use `npm run build` and deploy the `out` directory
- **AWS/GCP**: Use Docker or serverless functions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on GitHub or contact the development team. 