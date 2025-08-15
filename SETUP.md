# Air Quality Prediction Dashboard - Setup Guide

## 🚀 Quick Start

### Option 1: Automatic Setup (Windows)
```bash
# Run the automatic setup script
start.bat
```

### Option 2: Manual Setup

#### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 2. Start Python Model Server
```bash
python model_server.py
```
This will:
- Load or train your Random Forest and AdaBoost models
- Start a Flask server on port 5000
- Serve predictions via REST API

#### 3. Start Next.js Development Server
```bash
npm run dev
```
This will:
- Start the Next.js app on port 3000
- Serve the interactive dashboard

## 🔧 Troubleshooting

### Common Issues

#### 1. "next is not recognized"
**Solution:** Make sure you're in the project directory and run:
```bash
npm install
```

#### 2. Python dependencies not found
**Solution:** Install Python dependencies:
```bash
pip install flask flask-cors pandas scikit-learn numpy joblib
```

#### 3. Model server connection error
**Solution:** 
- Make sure the Python server is running on port 5000
- Check that the CSV file exists in the project root
- The app will use fallback predictions if the model server is unavailable

#### 4. Map not loading
**Solution:**
- The map uses dynamic imports to avoid SSR issues
- Make sure you have an internet connection for map tiles
- The map will show a loading state if data is not available

#### 5. CSV parsing errors
**Solution:**
- The API now properly handles quoted CSV values
- Invalid coordinates are filtered out automatically
- Check that your CSV file has the correct format

## 📁 Project Structure

```
Air_quality_prediction/
├── app/
│   ├── api/
│   │   ├── air-quality-data/route.ts    # CSV data API
│   │   └── predict/route.ts             # Prediction API
│   ├── components/
│   │   ├── Map.tsx                      # Map wrapper
│   │   └── MapComponent.tsx             # Leaflet map
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Main dashboard
├── AQI-and-Lat-Long-of-Countries.csv   # Air quality data
├── app.py                               # Original Python training
├── model_server.py                      # Flask model server
├── requirements.txt                     # Python dependencies
├── package.json                         # Node.js dependencies
├── start.bat                           # Windows startup script
└── README.md                           # Main documentation
```

## 🔄 API Endpoints

### GET /api/air-quality-data
Returns air quality data from CSV file.

### POST /api/predict
Makes predictions using trained models.

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
  "prediction": 45.5,
  "rf_prediction": 44.2,
  "adaboost_prediction": 46.8,
  "inputs": { ... }
}
```

## 🎯 Features Working

✅ **Dashboard Statistics** - Real-time AQI calculations  
✅ **Interactive Charts** - Bar charts for pollutant levels  
✅ **Prediction Interface** - ML-powered AQI predictions  
✅ **Interactive Map** - Geographic data visualization  
✅ **Model Integration** - Random Forest + AdaBoost models  
✅ **Responsive Design** - Works on all devices  
✅ **Error Handling** - Graceful fallbacks  

## 🚀 Deployment

### Local Development
```bash
# Terminal 1: Start model server
python model_server.py

# Terminal 2: Start Next.js app
npm run dev
```

### Production Deployment
1. **Vercel (Recommended):**
   - Push to GitHub
   - Connect to Vercel
   - Deploy automatically

2. **Docker:**
   ```dockerfile
   # Add Dockerfile for containerized deployment
   ```

## 🔍 Monitoring

### Model Server Health Check
```bash
curl http://localhost:5000/health
```

### Next.js App Status
```bash
curl http://localhost:3000/api/air-quality-data
```

## 📊 Data Flow

1. **CSV Data** → API Route → Dashboard
2. **User Input** → Prediction API → Model Server → Results
3. **Map Data** → Leaflet Component → Interactive Visualization

## 🛠️ Development

### Adding New Features
1. **Charts:** Modify `app/page.tsx`
2. **APIs:** Add routes in `app/api/`
3. **Models:** Update `model_server.py`
4. **Styling:** Edit `tailwind.config.js`

### Testing
```bash
# Test model server
python -c "import requests; print(requests.post('http://localhost:5000/predict', json={'co':1,'ozone':30,'no2':5,'pm25':25,'lat':40,'lng':-74}).json())"

# Test Next.js API
curl -X POST http://localhost:3000/api/predict -H "Content-Type: application/json" -d '{"co":1,"ozone":30,"no2":5,"pm25":25,"lat":40,"lng":-74}'
```

## 🎉 Success!

Your Air Quality Prediction Dashboard is now fully functional with:
- ✅ Real ML model integration
- ✅ Interactive data visualization
- ✅ Geographic mapping
- ✅ Responsive design
- ✅ Error handling and fallbacks

Visit `http://localhost:3000` to see your dashboard in action! 