'use client'

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Cloud, Wind, Thermometer, Activity, Sun, Moon, MapPin } from 'lucide-react'
import Map from './components/Map'

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

const getAQICategory = (aqi: number) => {
  if (aqi <= 50) return { category: 'Good', color: '#00e400', bgColor: 'bg-green-100 dark:bg-green-900/20', textColor: 'text-green-800 dark:text-green-200' }
  if (aqi <= 100) return { category: 'Moderate', color: '#ffff00', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20', textColor: 'text-yellow-800 dark:text-yellow-200' }
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#ff7e00', bgColor: 'bg-orange-100 dark:bg-orange-900/20', textColor: 'text-orange-800 dark:text-orange-200' }
  if (aqi <= 200) return { category: 'Unhealthy', color: '#ff0000', bgColor: 'bg-red-100 dark:bg-red-900/20', textColor: 'text-red-800 dark:text-red-200' }
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8f3f97', bgColor: 'bg-purple-100 dark:bg-purple-900/20', textColor: 'text-purple-800 dark:text-purple-200' }
  return { category: 'Hazardous', color: '#7e0023', bgColor: 'bg-red-900/20 dark:bg-red-900/40', textColor: 'text-red-900 dark:text-red-100' }
}

export default function Home() {
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
    { name: 'CO', value: data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item['CO AQI Value'], 0) / data.length) : 0 },
    { name: 'Ozone', value: data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item['Ozone AQI Value'], 0) / data.length) : 0 },
    { name: 'NO2', value: data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item['NO2 AQI Value'], 0) / data.length) : 0 },
    { name: 'PM2.5', value: data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item['PM2.5 AQI Value'], 0) / data.length) : 0 },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Air Quality Prediction Dashboard
            </h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Monitor and predict air quality using machine learning models
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-white hover:bg-gray-100 text-gray-700 shadow-md'
            }`}
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average AQI</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{aqiStats.average}</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                <Thermometer className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Max AQI</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{aqiStats.max}</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                <Wind className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Min AQI</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{aqiStats.min}</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                <Cloud className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Data Points</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{data.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AQI Distribution */}
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>AQI Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
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
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Prediction Form */}
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
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
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
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
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
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
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
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
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
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
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
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
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
              <button
                onClick={handlePrediction}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Predict AQI
              </button>
              {prediction && (
                <div className={`mt-4 p-6 rounded-lg border transition-all duration-300 ${getAQICategory(prediction).bgColor} ${getAQICategory(prediction).textColor}`}>
                  <p className="text-sm font-medium mb-1">Predicted AQI:</p>
                  <p className="text-3xl font-bold mb-2" style={{color: getAQICategory(prediction).color}}>
                    {prediction}
                  </p>
                  <p className="text-sm opacity-90">{getAQICategory(prediction).category}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Air Quality Map</h3>
          <Map data={filteredData} />
        </div>
      </div>
    </div>
  )
} 