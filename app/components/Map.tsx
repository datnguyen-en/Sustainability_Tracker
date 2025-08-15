'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>
})

interface AirQualityData {
  'AQI Value': number
  'CO AQI Value': number
  'Ozone AQI Value': number
  'NO2 AQI Value': number
  'PM2.5 AQI Value': number
  lat: number
  lng: number
}

interface MapProps {
  data: AirQualityData[]
}

export default function Map({ data }: MapProps) {
  return <MapComponent data={data} />
} 