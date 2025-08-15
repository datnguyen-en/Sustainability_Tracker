import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'AQI-and-Lat-Long-of-Countries.csv')
    
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ error: 'CSV file not found' }, { status: 404 })
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file is empty or invalid' }, { status: 400 })
    }

    // Parse headers - remove quotes and split by comma
    const headerLine = lines[0]
    const headers = headerLine.split(',').map(h => h.replace(/"/g, '').trim())
    
    // Parse data rows
    const data = lines.slice(1).map(line => {
      // Split by comma but handle quoted values
      const values = line.split(',').map(v => v.replace(/"/g, '').trim())
      const row: any = {}
      
      headers.forEach((header, index) => {
        const value = values[index]
        // Convert to number if possible, otherwise use 0
        const numValue = parseFloat(value)
        row[header] = isNaN(numValue) ? 0 : numValue
      })
      
      return row
    }).filter(row => {
      // Filter out rows with invalid coordinates
      return row.lat && row.lng && !isNaN(row.lat) && !isNaN(row.lng)
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading CSV:', error)
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
} 