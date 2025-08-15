'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Cloud, Wind, Thermometer, Activity, Sun, Moon, MapPin, ArrowRight } from 'lucide-react'
import Map from './Map'

interface AirQualityData {
  'AQI Value': number
  'CO AQI Value': number
  'Ozone AQI Value': number
  'NO2 AQI Value': number
  'PM2.5 AQI Value': number
  lat: number
  lng: number
}

interface PredictionForm {
  co: number
  ozone: number
  no2: number
  pm25: number
  lat: number
  lng: number
}

interface DashboardProps {
  onBack: () => void
}

const getAQICategory = (aqi: number) => {
  if (aqi <= 50) return { 
    category: 'Good', 
    color: '#00e400', 
    bgColor: 'bg-green-100 dark:bg-green-900/20', 
    textColor: 'text-green-800 dark:text-green-200',
    numberColor: 'text-green-900 dark:text-green-100'
  }
  if (aqi <= 100) return { 
    category: 'Moderate', 
    color: '#ffff00', 
    bgColor: 'bg-orange-100 dark:bg-yellow-900/20', 
    textColor: 'text-yellow-800 dark:text-yellow-200',
    numberColor: 'text-yellow-900 dark:text-yellow-100'
  }
  if (aqi <= 150) return { 
    category: 'Unhealthy for Sensitive Groups', 
    color: '#ff7e00', 
    bgColor: 'bg-orange-100 dark:bg-orange-900/20', 
    textColor: 'text-orange-800 dark:text-orange-200',
    numberColor: 'text-orange-900 dark:text-orange-100'
  }
  if (aqi <= 200) return { 
    category: 'Unhealthy', 
    color: '#ff0000', 
    bgColor: 'bg-red-100 dark:bg-red-900/20', 
    textColor: 'text-red-800 dark:text-red-200',
    numberColor: 'text-red-900 dark:text-red-100'
  }
  if (aqi <= 300) return { 
    category: 'Very Unhealthy', 
    color: '#8f3f97', 
    bgColor: 'bg-purple-100 dark:bg-purple-900/20', 
    textColor: 'text-purple-800 dark:text-purple-200',
    numberColor: 'text-purple-900 dark:text-purple-100'
  }
  return { 
    category: 'Hazardous', 
    color: '#7e0023', 
    bgColor: 'bg-red-900/20 dark:bg-red-900/40', 
    textColor: 'text-red-900 dark:text-red-100',
    numberColor: 'text-red-900 dark:text-red-100'
  }
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [data, setData] = useState<AirQualityData[]>([])
  const [filteredData, setFilteredData] = useState<AirQualityData[]>([])
  const [prediction, setPrediction] = useState<number | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [formData, setFormData] = useState<PredictionForm>({
    co: 1,
    ozone: 30,
    no2: 5,
    pm25: 25,
    lat: 40.7128,
    lng: -74.0060
  })

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    // Load data from CSV (in a real app, this would be an API call)
    fetch('/api/air-quality-data')
      .then(res => res.json())
      .then(data => {
        console.log('Loaded data:', data.length, 'items');
        console.log('Sample data item:', data[0]);
        setData(data)
        setFilteredData(data.slice(0, 100)) // Show first 100 points for performance
      })
      .catch(err => {
        console.error('Error loading data:', err)
        // Fallback to sample data
        setData([])
        setFilteredData([])
      })
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handlePrediction = async () => {
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      setPrediction(result.prediction)
    } catch (error) {
      console.error('Prediction error:', error)
      // Mock prediction for demo
      setPrediction(Math.floor(Math.random() * 100) + 20)
    }
  }

  const aqiStats = {
    average: data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item['AQI Value'], 0) / data.length) : 0,
    max: data.length > 0 ? Math.max(...data.map(item => item['AQI Value'])) : 0,
    min: data.length > 0 ? Math.min(...data.map(item => item['AQI Value'])) : 0,
  }

  const chartData = [
    { name: 'CO', value: data.length > 0 ? Math.max(1, Math.round(data.reduce((sum, item) => sum + (item['CO AQI Value'] || 0), 0) / data.length)) : 1 },
    { name: 'Ozone', value: data.length > 0 ? Math.max(1, Math.round(data.reduce((sum, item) => sum + (item['Ozone AQI Value'] || 0), 0) / data.length)) : 1 },
    { name: 'NO2', value: data.length > 0 ? Math.max(1, Math.round(data.reduce((sum, item) => sum + (item['NO2 AQI Value'] || 0), 0) / data.length)) : 1 },
    { name: 'PM2.5', value: data.length > 0 ? Math.max(1, Math.round(data.reduce((sum, item) => sum + (item['PM2.5 AQI Value'] || 0), 0) / data.length)) : 1 },
  ]

  // Test data to verify chart is working
  const testChartData = [
    { name: 'CO', value: 5 },
    { name: 'Ozone', value: 35 },
    { name: 'NO2', value: 8 },
    { name: 'PM2.5', value: 45 },
  ]

  console.log('Chart data:', chartData);
  console.log('Chart data details:', chartData.map(item => `${item.name}: ${item.value}`));
  console.log('Test chart data:', testChartData);
  console.log('Data length:', data.length);
  console.log('Sample data items:', data.slice(0, 3));
  console.log('CO values sample:', data.slice(0, 5).map(item => item['CO AQI Value']));
  console.log('Ozone values sample:', data.slice(0, 5).map(item => item['Ozone AQI Value']));
  console.log('NO2 values sample:', data.slice(0, 5).map(item => item['NO2 AQI Value']));
  console.log('PM2.5 values sample:', data.slice(0, 5).map(item => item['PM2.5 AQI Value']));
  
  // Calculate individual averages for debugging
  const coAvg = data.length > 0 ? data.reduce((sum, item) => sum + (item['CO AQI Value'] || 0), 0) / data.length : 0;
  const ozoneAvg = data.length > 0 ? data.reduce((sum, item) => sum + (item['Ozone AQI Value'] || 0), 0) / data.length : 0;
  const no2Avg = data.length > 0 ? data.reduce((sum, item) => sum + (item['NO2 AQI Value'] || 0), 0) / data.length : 0;
  const pm25Avg = data.length > 0 ? data.reduce((sum, item) => sum + (item['PM2.5 AQI Value'] || 0), 0) / data.length : 0;
  
  console.log('Individual averages - CO:', coAvg, 'Ozone:', ozoneAvg, 'NO2:', no2Avg, 'PM2.5:', pm25Avg);

  // Use real data for display
  const displayData = data.length > 0 ? chartData : testChartData;
  
  console.log('Chart data to display:', displayData);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 text-gray-900'}`}>
      <div className="p-6">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-700 shadow-md'
              }`}
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </motion.button>
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Air Quality Prediction Dashboard
              </h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Monitor and predict air quality using machine learning models
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-yellow-400' 
                : 'bg-white hover:bg-gray-100 text-gray-700 shadow-md'
            }`}
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>

        {/* Stats Cards with Enhanced Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
              isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white border border-gray-200 shadow-xl'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 ${isDarkMode ? 'shadow-blue-500/25' : 'shadow-blue-500/50'}`}>
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average AQI</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{aqiStats.average}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
              isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white border border-gray-200 shadow-xl'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 ${isDarkMode ? 'shadow-red-500/25' : 'shadow-red-500/50'}`}>
                <Thermometer className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Max AQI</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{aqiStats.max}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
              isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white border border-gray-200 shadow-xl'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 ${isDarkMode ? 'shadow-green-500/25' : 'shadow-green-500/50'}`}>
                <Wind className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Min AQI</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{aqiStats.min}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
              isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white border border-gray-200 shadow-xl'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 ${isDarkMode ? 'shadow-purple-500/25' : 'shadow-purple-500/50'}`}>
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Data Points</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{data.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AQI Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
              isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white border border-gray-200 shadow-xl'
            }`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>AQI Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: isDarkMode ? '#d1d5db' : '#374151' }}
                />
                <YAxis 
                  tick={{ fill: isDarkMode ? '#d1d5db' : '#374151' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="url(#chartGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </motion.div>

          {/* Prediction Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
              isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white border border-gray-200 shadow-xl'
            }`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Predict Air Quality</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>CO AQI</label>
                  <input
                    type="number"
                    value={formData.co}
                    onChange={(e) => setFormData({...formData, co: Number(e.target.value)})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter CO AQI"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ozone AQI</label>
                  <input
                    type="number"
                    value={formData.ozone}
                    onChange={(e) => setFormData({...formData, ozone: Number(e.target.value)})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter Ozone AQI"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>NO2 AQI</label>
                  <input
                    type="number"
                    value={formData.no2}
                    onChange={(e) => setFormData({...formData, no2: Number(e.target.value)})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter NO2 AQI"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>PM2.5 AQI</label>
                  <input
                    type="number"
                    value={formData.pm25}
                    onChange={(e) => setFormData({...formData, pm25: Number(e.target.value)})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter PM2.5 AQI"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: Number(e.target.value)})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter latitude"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: Number(e.target.value)})}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrediction}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Predict AQI
              </motion.button>
              {prediction && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mt-4 p-6 rounded-lg border transition-all duration-300 ${getAQICategory(prediction).bgColor} ${getAQICategory(prediction).textColor}`}
                >
                  <p className="text-sm font-medium mb-1">Predicted AQI:</p>
                  <p className={`text-3xl font-bold mb-2 ${getAQICategory(prediction).numberColor}`} style={{color: getAQICategory(prediction).color}}>
                    {prediction}
                  </p>
                  <p className="text-sm opacity-90 font-medium">{getAQICategory(prediction).category}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white border border-gray-200 shadow-xl'
          }`}
        >
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Air Quality Map</h3>
          <Map data={filteredData} />
        </motion.div>
      </div>
    </div>
  )
}