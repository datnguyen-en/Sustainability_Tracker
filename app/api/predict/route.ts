import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { co, ozone, no2, pm25, lat, lng } = body

    // Validate input
    if (!co || !ozone || !no2 || !pm25 || !lat || !lng) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Call Python model server
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ co, ozone, no2, pm25, lat, lng }),
      })

      if (!response.ok) {
        throw new Error(`Model server responded with status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      return NextResponse.json(result)
    } catch (modelError) {
      console.error('Model server error:', modelError)
      
      // Fallback to simple prediction if model server is not available
      const fallbackPrediction = Math.round(
        (co * 0.1 + ozone * 0.3 + no2 * 0.2 + pm25 * 0.4) * 2 + 
        Math.random() * 20 + 20
      )
      
      const clampedPrediction = Math.max(0, Math.min(500, fallbackPrediction))
      
      return NextResponse.json({ 
        prediction: clampedPrediction,
        rf_prediction: clampedPrediction,
        adaboost_prediction: clampedPrediction,
        inputs: { co, ozone, no2, pm25, lat, lng },
        note: 'Using fallback prediction (model server unavailable)'
      })
    }
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json({ error: 'Failed to make prediction' }, { status: 500 })
  }
} 