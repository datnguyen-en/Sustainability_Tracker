'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing')

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'landing' ? (
        <LandingPage key="landing" onEnter={() => setCurrentPage('dashboard')} />
      ) : (
        <Dashboard key="dashboard" onBack={() => setCurrentPage('landing')} />
      )}
    </AnimatePresence>
  )
} 